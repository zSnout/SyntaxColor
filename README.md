# SyntaxColor
Having trouble with syntax highlighting? Need a simple, yet powerful parser? Welcome to SyntaxColor, a simple yet powerful syntax highlighter. It's the last one you'll ever need.

---

## Rules

The SyntaxColor parser requires that you pass rules for it to color. A rule is an object that contains properties that help the parser decide what to color.

Each rule must contain the `regex` and `token` properties, and may contain `case` and/or `next` properties.

#### `regex`
The `regex` property contains either a regular expression to match, or a regular expression in the form of a string.
For example, `/Hello world/` and `"Hello world"` are both valid values, but `23` is not.
Any flags except `i` on the regular expression will be removed.

#### `token`
The `token` property can contain either a string, an array, or a function.

##### String
If the `token` property is a string, the result matched by `regex` will be wrapped in a `<span>` with a class of `token`.
To add several classes, use class names seperated by `.`.
