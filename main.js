window.escapeText = function(text) {
	return text
		.replace(/&/g,"&amp;")
		.replace(/</g,"&lt;")
		.replace(/>/g,"&gt;")
		.replace(/"/g,"&quot;")
		.replace(/'/g,"&apos;");
};

window.escapeChar = function(text) {
	if (text.length == 1) {
		return window.escapeText(text);
	} else {
		return text;
	}
};

window.parseRules = function(rules) {
	if (Array.isArray(rules)) {
		rules = {"start": rules};
	}
	
	for (var i = 0;i < Object.keys(rules).length;i++) {
		var thisState = Object.keys(rules)[i];
		var thisRules = rules[thisState];
		
		for (var j = 0;j < thisRules.length;j++) {
			if (thisRules[j].defaultToken !== undefined) {
				continue;
			}
			
			if (thisRules[j].regex === undefined || thisRules[j].token === undefined) {
				rules[thisState].splice(j,1);
				j--;
				continue;
			}
			
			if ((thisRules[j].token === null || thisRules[j].token === undefined) && thisRules[j].tokenList !== undefined) {
				rules[thisState][j].token = thisRules[j].tokenList;
			}
			if ((thisRules[j].token === null || thisRules[j].token === undefined) && thisRules[j].tokenArray !== undefined) {
				rules[thisState][j].token = thisRules[j].tokenArray;
			}
			
			if (thisRules[j].next === null && thisRules[j].nextState !== undefined) {
				rules[thisState][j].next = thisRules[j].nextState;
			}
			
			if (typeof thisRules[j].regex == "string") {
				rules[thisState][j].regex = (new RegExp(thisRules[j].regex)).valueOf();
			}
			
			var regex = new RegExp(rules[thisState][j].regex);
			regex.global = false;
			regex.ignoreCase = rules[thisState][j].caseSensitive === undefined ? regex.ignoreCase : !(rules[thisState][j].caseSensitive);
			regex.multiline = false;
			regex.dotAll = false;
			regex.unicode = false;
			regex.sticky = false;
			
			rules[thisState][j].regex = regex;
		}
	}
	
	return rules;
};

window.addClasses = function(match,token,prefix) {
	if (typeof match == "string") {
		match = [match];
	}
	
	if (typeof token == "string") {
		var tokens = token.split(".");
		for (var i = 0;i < tokens.length;i++) {
			tokens[i] = prefix + tokens[i];
		}
		
		return "<span class=\"" + window.escapeText(tokens.join(" ")) + "\">" + window.escapeText(match[0]) + "</span>";
	} else if (Array.isArray(token)) {
		var text = "";
		for (var j = 1;j <= token.length;j++) {
			text += window.addClasses(match[j],token[j - 1],prefix);
		}
		
		return text;
	} else if (typeof token == "function") {
		return window.addClasses(match,token(match),prefix);
	}
};

window.compress = function(html) {
	var matcher =
		/(<span class="([^"]+)">)((?:[^<>"'&]|&lt;|&gt;|&quot;|&apos;|&amp;)+)<\/span>((?:<span class="\2">(?:(?:[^<>"'&]|&lt;|&gt;|&quot;|&apos;|&amp;)+)<\/span>)+)/g;
	var nonglobal =
		/(<span class="([^"]+)">)((?:[^<>"'&]|&lt;|&gt;|&quot;|&apos;|&amp;)+)<\/span>((?:<span class="\2">(?:(?:[^<>"'&]|&lt;|&gt;|&quot;|&apos;|&amp;)+)<\/span>)+)/;
	var splitter = /<\/span><span class="[^"]+">/g;
	
	return html.replace(matcher,function(m) {
		var match = (typeof m == "string" ? m : m[0]).match(nonglobal.valueOf());
		
		var start = match[1];
		var classes = match[2];
		
		var chars = match[4];
		chars = chars.substr(start.length,chars.length - start.length - "</span>".length);
		chars = chars.split(splitter);
		
		return start + match[3] + chars.join("") + "</span>";
	});
};

window.changeSpaces = function(html) {
    var matcher = / {2,}/g;
    
    return html.replace(matcher,function(m) {
        if (typeof m == "object") {
            m = m[0];
        }
        
        var txt = "&zwnj;";
        for (var i = 0;i < m.length;i++) {
            txt += "&nbsp;&zwnj;";
        }
        return txt;
    });
};

window.highlightLine = function(line,allRules,state,prefix) {
	rules = allRules[state];
	
	if (line === "") {
		return {
			html: "",
			state: state
		};
	}
	
	var span = line.substr(0,1);
	var other = line.substr(1);
	var matching = true;
	
	for (var i = 0;i < rules.length;i++) {
		if (!matching) {
			break;
		}
		if (rules[i].regex !== undefined && rules[i].token !== undefined) {
			var match = line.match(rules[i].regex);
			
			if (match !== null && match.index === 0) {
				span = addClasses(match,rules[i].token,prefix);
				
				if (rules[i].next !== undefined) {
					state = rules[i].next;
				}
				other = line.substr(match[0].length);
				matching = false;
			}
		} else if (rules[i].defaultToken !== undefined) {
			span = addClasses(span,rules[i].defaultToken,prefix);
			
			if (rules[i].next !== undefined) {
				state = rules[i].next;
			}
			
			matching = false;
		}
	}
	
	other = window.highlightLine(other,allRules,state,prefix);
	return {
		html: window.escapeChar(span) + other.html,
		state: other.state
	};
};

window.highlight = function(text,rules,prefix) {
	prefix = prefix || "zsnout_";
	
	text = text.split("\n");
	var html = [];
	var state = "start";
	rules = window.parseRules(rules);
	
	for (var i = 0;i < text.length;i++) {
		var line = window.highlightLine(text[i],rules,state,prefix);
		html.push(line.html);
		state = line.state;
	}
	
	return window.changeSpaces(window.compress(html.join("<br>")));
};
