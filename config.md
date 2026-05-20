# Code Your Answer — Configuration

**Note:** Restart Anki after saving changes for them to take effect.

## Editor

### theme

Sets the CodeMirror editor theme. Leave empty (`""`) to use the default themes that follow Anki's light/dark mode (GitHub Light in light mode, One Dark in dark mode).

Set to any theme name below to pin that theme regardless of Anki's mode.

**Default:** `""` (auto)

#### Light themes

- `basicLight`
- `githubLight`
- `gruvboxLight`
- `highContrastLight`
- `materialLight`
- `solarizedLight`
- `tokyoNightDay`
- `vsCodeLight`

#### Dark themes

- `abcdef`
- `abyss`
- `androidStudio`
- `andromeda`
- `basicDark`
- `catppuccinMocha`
- `cobalt2`
- `forest`
- `githubDark`
- `gruvboxDark`
- `highContrastDark`
- `materialDark`
- `materialOcean`
- `monokai`
- `nord`
- `palenight`
- `solarizedDark`
- `synthwave84`
- `tokyoNightStorm`
- `volcano`
- `vsCodeDark`

Preview themes at https://fsegurai.github.io/codemirror-themes/playground.html

---

### indentUnit

Number of spaces used for each level of indentation.

**Default:** `4`

---

### indentWithTab

Allows pressing `Tab` to indent the current line or selection.

**Default:** `true`

---

### autocompletion

Shows inline code completion suggestions while typing. Disabled by default — keeping it off is recommended when using the editor for learning, so you write code from memory.

**Default:** `false`

---

### fontSize

Font size of the editor content in pixels.

**Default:** `14`

