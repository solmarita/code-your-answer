# Code Your Answer

An Anki addon for coding practice. Type your answers in an IDE-style input field and get an instant, character-level diff against the solution.

![Code Your Answer Review Interface](https://github.com/solmarita/code-your-answer/blob/main/docs/screens.png)

## ⚠️ Compatibility

This add-on is **only supported on Anki Desktop**.

It relies on features such as custom JavaScript bundles, local asset loading, and add-on integrations that are not available in AnkiWeb or other restricted Anki environments.

## Features

- **Custom Note Type**: Details below.
- **IDE-Style Input**: Powered by CodeMirror.
- **Three-Part Review**:
    - **Diff**: A character-level comparison between your attempt and the predefined solution.
    - **Your Attempt**: A syntax-highlighted view of exactly what you typed for your convenience.
    - **Expected Answer**: A syntax-highlighted view of the predefined solution for your convenience.  

## Note Type Fields

The add-on creates a new note type (Code Your Answer) with the following fields:

| Field | Required | Description |
|-------|----------|-------------|
| **Front** | ✅ Yes | The question/prompt |
| **Language** | ✅ Yes | Language code (e.g., `python`, `javascript`, `rust`) |
| **Back** | ✅ Yes | Your code answer |
| **Back Extra** | ❌ Optional | Additional notes, explanations, or context |

### Understanding the Diff

The Diff section provides a comparison of your code against the predefined solution. It uses the following color-coding to highlight discrepancies:

| Color | Meaning | Description |
| --- | --- | --- |
| ![#f03c15](https://github.com/solmarita/code-your-answer/blob/main/docs/diff_shades/afa.png) Green| **Match** | Characters you typed that match the solution exactly. |
| ![#f03c15](https://github.com/solmarita/code-your-answer/blob/main/docs/diff_shades/ccc.png) Grey| **Omissions** | Code that is in the solution but is missing from your attempt. |
| ![#f03c15](https://github.com/solmarita/code-your-answer/blob/main/docs/diff_shades/faa.png) Red| **Extra** | Characters you typed that are not in the solution (typos, new names, extra logic etc). |

![Diff Example](https://github.com/solmarita/code-your-answer/blob/main/docs/diff_example.png)

## Keyboard Shortcuts

Designed for a hands-on-keyboard workflow:

- **`Tab`**: Performs **Indentation** by inserting 4 spaces (for all languges). This ensures your code structure is clean and readable, a standard requirement for almost all programming languages (especially Python!).
- **`Ctrl + Enter`** (or `Cmd + Enter`): Submits your answer and reveals the back of the card.

## Editor Configuration

Go to **Tools → Add-ons → Code Your Answer → Config** to customise the editor. Restart Anki after saving for changes to take effect.

| Option | Default | Description |
|--------|---------|-------------|
| `theme` | `""` | Editor colour theme. Empty string uses the default themes (GitHub Light / One Dark) that follow Anki's light/dark mode. Set to a theme name to pin it regardless of mode. See the full list at [fsegurai.github.io/codemirror-themes](https://fsegurai.github.io/codemirror-themes/). View themes in action at the [Playground](https://fsegurai.github.io/codemirror-themes/playground.html). |
| `indentUnit` | `4` | Number of spaces per indentation level. |
| `indentWithTab` | `true` | Allow the `Tab` key to indent. |
| `autocompletion` | `false` | Show inline code completion suggestions. Disabled by default — keeping it off is recommended when using the editor for learning. |

> Some basic editor behaviours — such as bracket matching and auto-closing brackets — are hardcoded and cannot be changed. More options will be added in future releases.

## Supported Languages

| Language | Acceptable Aliases (Case-Insensitive) |
| --- | --- |
| **JavaScript** | `js`, `jsx`, `node`, `javascript`, `ecmascript` |
| **TypeScript** | `ts`, `tsx`, `typescript` |
| **Python** | `py`, `py3`, `python3`, `python`, `pypy` |
| **Rust** | `rs`, `rustlang`, `rust` |
| **PHP** | `php`, `php8`, `php7` |
| **Go** | `go`, `golang` |
| **Zig** | `zig`, `ziglang` |
| **C++** | `cpp`, `c++`, `cc`, `hpp`, `h++` |
| **C** | `c`, `h` |
| **Java** | `java`, `jar` |
| **C#** | `cs`, `csharp`, `c#` |
| **HTML** | `html`, `htm` |
| **CSS** | `css` |
| **XML** | `xml`, `svg` |
| **Sass** | `sass`, `scss` |
| **Less** | `less` |
| **Vue** | `vue` |
| **Angular** | `angular`, `ng` |
| **SQL** | `sql`, `mysql`, `postgres`, `psql` |
| **WebAssembly** | `wasm`, `wat` |
| **Shell** | `sh`, `bash`, `zsh`, `shell`, `batch`, `ps1` |
| **YAML** | `yaml`, `yml` |
| **JSON** | `json` |
| **Markdown** | `md`, `markdown` |
| **Swift** | `swift` |
| **Kotlin** | `kt`, `kotlin` |
| **Dart** | `dart`, `flutter` |
| **Ruby** | `rb`, `ruby`, `rails` |
| **Scala** | `scala` |
| **R** | `r`, `rscript` |
| **MATLAB** | `matlab`, `m` |

## Language Testing

Manual test status — verified by loading the language in the editor and confirming the following work correctly: syntax highlighting, auto indentation, auto-closing brackets, and bracket matching.

| Language | Tested |
|----------|--------|
| JavaScript | ⬜ |
| TypeScript | ⬜ |
| Python | ⬜ |
| Rust | ⬜ |
| PHP | ⬜ |
| Go | ⬜ |
| Zig | ⬜ |
| C++ | ⬜ |
| C | ⬜ |
| Java | ⬜ |
| C# | ⬜ |
| HTML | ⬜ |
| CSS | ⬜ |
| XML | ⬜ |
| Sass | ⬜ |
| Less | ⬜ |
| Vue | ⬜ |
| Angular | ⬜ |
| SQL | ⬜ |
| WebAssembly | ⬜ |
| Shell | ⬜ |
| YAML | ⬜ |
| JSON | ⬜ |
| Markdown | ⬜ |
| Swift | ⬜ |
| Kotlin | ⬜ |
| Dart | ⬜ |
| Ruby | ⬜ |
| Scala | ⬜ |
| R | ⬜ |
| MATLAB | ⬜ |

## Request a Language

Don't see your language? Check if CodeMirror supports it:
- **Modern languages:** https://code.haverbeke.berlin/codemirror
- **Legacy modes:** https://code.haverbeke.berlin/codemirror/legacy-modes

If you find it there, [open an issue](https://github.com/solmarita/code-your-answer/issues/new) with the language name and I'll add it. If it's not there, I'll do my best to find a third-party package.

## Installation

Since this addon is not yet published on AnkiWeb, it must be installed manually.

### Option 1: Download as a ZIP (Easiest)

1. **Download the code**: Click the green **Code** button at the top of this page and select **Download ZIP**. 
2. **Unzip the folder**: Extract the contents of the ZIP file on your computer.
    
### Option 2: Clone with Git (Best for Updates)

If you have Git installed, run the following in your terminal:

```bash
git clone https://github.com/solmarita/code-your-answer.git
```

### Finalizing the Install

1. **Locate your Anki addons folder**:
    
    - Open Anki, go to `Tools > Add-ons`.  
    - Click **View Files** to open the `addons21` directory.
        
2. **Copy the project folder**: Move the `code-your-answer` folder into the `addons21/` directory.
3. **Restart Anki**: Close and reopen Anki to activate the addon.

## Development

**DISCLAIMER:** This addon is under active development and may change frequently!

### Setup

**Option 1: Clone directly to Anki's addon folder**
```bash
cd <path_to_anki_addons_folder>
git clone https://github.com/solmarita/code-your-answer.git
cd code-your-answer
```

**Option 2: Clone elsewhere and symlink**
```bash
# Clone to your preferred location
git clone https://github.com/solmarita/code-your-answer.git
cd code-your-answer

# Create symlink in Anki's addon folder
# macOS/Linux:
ln -s "$(pwd)" <path_to_anki_addons_folder>/code-your-answer

# Windows (run as Administrator):
mklink /D "<path_to_anki_addons_folder>\code-your-answer" "%CD%"
```

**Finding your Anki addons folder:**    
    - Open Anki, go to `Tools > Add-ons`.  
    - Click **View Files** to open the `addons21` directory.

**Install dependencies:**
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
npm install

# Enable dev mode
touch .dev  # Windows: type nul > .dev

# Build
npm run build
```

### Development Workflow

```bash
# Make changes to __init__.py or src/ files
npm run build
# Restart Anki to see changes
```

**Tip:** Install [AnkiRestart](https://ankiweb.net/shared/info/1766024579) for quick reloads during development.

### Dev Mode

The `.dev` file enables template auto-updates on Anki restart during development.

**Disable dev mode before release:**
```bash
rm .dev  # macOS/Linux
# Windows: del .dev
```