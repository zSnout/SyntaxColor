# SyntaxColor
Having trouble with syntax highlighting? Need a simple, yet powerful parser? Welcome to SyntaxColor, a simple yet powerful syntax highlighter. It's the last one you'll ever need.

---

## Rules

The SyntaxColor parser requires that you pass rules for it to color. A rule is an object that contains properties that help the parser decide what to color.

Each rule must contain the `regex` and `token` properties, and may contain `next` and/or `caseSensitive` properties.

#### `regex`
The `regex` property contains either a regular expression to match, or a regular expression in the form of a string.
For example, `/Hello world/` and `"Hello world"` are both valid values, but `23` is not.
Any flags except `i` on the regular expression will be removed.

#### `token` (aliases: `tokenList`, `tokenArray`)
The `token` property can contain either a string, an array, or a function.

##### String
If the `token` property is a string, the result matched by `regex` will be wrapped in a `<span>` with a class of `token`.
To add several classes, use class names seperated by `.`. Note that classes will have a prefix applied to them, so `abc` becomes `sc_abc`.

##### Array
If the `token` property is an array, each group in the `regex` will have the classes specified in the array added to them in order.

> **WARNING:** Make sure that you have as many groups in your `regex` as there are elements in the list, otherwise you may get unexpected results.

> **WARNING:** You should make sure that every character in your `regex` is contained in a group, and that groups are non-nested, otherwise you may get unexpected results.

##### Function
If the `token` property is a function, SyntaxColor will evaluate the function, passing the matched result in the way the browser returned it.
SyntaxColor will then take the returned result and evaluate it in the manner above.

#### `next` (alias: `nextState`)
The `next` property is **NOT REQUIRED**, and defaults to the current state.
It specifies the next state for the parser to go to. More on states later.
#### `caseSensitive`
The `caseSensitive` property is **NOT REQUIRED**, and defaults to `true`.
It specifies whether the regular expression should be matched as case-sensitive.

> **WARNING:** If the `i` flag is set on the regular expression, it overrides the `caseSensitive` option.

---

## States

The SyntaxColor parser groups rules into different states, which the parser goes through based on the rules specified.

The parser always starts in the `"start"` state, so that state is where you should put your beginnng rules.

Then, as the parser evaluates your rules, if it encounters a match and the `next` property is set, it goes to the state specified by the `next` property.

---

## Rule Set

A rule set is a JavaScript array containing several rules.

Here's the format for a rule set:
``` javascript
[
    rule1,
    rule2,
    ...
]
```

---

## Complete Rule Set

A complete rule set contains several states and their rule sets.

Here's the format for a complete rule set:
``` javascript
{
    state1: ruleSet1,
    state2: ruleSet2,
    ...
}
```
