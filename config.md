# Code Your Answer — Configuration

## `theme`

Sets the CodeMirror editor theme. Leave empty (`""`) to use the default themes that follow Anki's light/dark mode (GitHub Light in light mode, One Dark in dark mode).

Set to any theme name below to pin that theme regardless of Anki's mode.

**Default:** `""` (auto)

### Light themes

- `basicLight`
- `githubLight`
- `gruvboxLight`
- `highContrastLight`
- `materialLight`
- `solarizedLight`
- `tokyoNightDay`
- `vsCodeLight`

### Dark themes

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

### Example

```json
{
  "theme": "nord"
}
```
