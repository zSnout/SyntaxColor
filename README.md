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
If the `token` property is an array, each group in the `regex` will have the classes specified in the array added to it in order.

For example, in
```javascript
{
  regex: /(hello)( world)/`,
  token: ["word","long"]
}
```
, the text `"I said hello world."` would output `"I said <span class='zsnout_word'>hello</span><span class='zsnout_long'> world</span>"`.

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
