# Code Your Answer

An Anki addon for coding practice. Type your answers in an IDE-style input field and get an instant, character-level diff against the solution.

![Code Your Answer Review Interface](https://github.com/solmarita/code-your-answer/blob/main/docs/screens.png)

## Development

**DISCLAIMER:** This addon is under active development and may change frequently!

## ⚠️ Compatibility

This add-on is **only supported on Anki Desktop**.

It relies on features such as custom JavaScript bundles, local asset loading, and add-on integrations that are not available in AnkiWeb or other restricted Anki environments.

## Features

- **Custom Note Type**:
    - **Front**: The coding prompt or question.
    - **Language**: Sets the highlighting and editor rules (e.g., `python`, `javascript`).
    - **Back**: The raw code solution.
    - **Back Extra**: Context, explanations, or documentation.   
- **IDE-Style Input**: Powered by CodeMirror.
- **Three-Part Review**:
    - **Diff**: A character-level comparison between your attempt and the predefined solution.
    - **Your Attempt**: A syntax-highlighted view of exactly what you typed for your convenience.
    - **Expected Answer**: A syntax-highlighted view of the predefined solution for your convenience.  
  
### Understanding the Diff

The Diff section provides a comparison of your code against the predefined solution. It uses the following color-coding to highlight discrepancies:

| Color | Meaning | Description |
| --- | --- | --- |
| ![#f03c15](https://github.com/solmarita/code-your-answer/blob/main/docs/diff_shades/afa.png) Green| **Match** | Characters you typed that match the solution exactly. |
| ![#f03c15](https://github.com/solmarita/code-your-answer/blob/main/docs/diff_shades/ccc.png) Grey| **Omissions** | Code that is in the solution but is missing from your attempt. |
| ![#f03c15](https://github.com/solmarita/code-your-answer/blob/main/docs/diff_shades/faa.png) Red| **Extra** | Characters you typed that are not in the solution (typos, new names, extra logic etc). |

## Keyboard Shortcuts

Designed for a hands-on-keyboard workflow:

- **`Tab`**: Inserts 4 spaces (standardized for all languages). 
- **`Ctrl + Enter`** (or `Cmd + Enter`): Submits your answer and reveals the back of the card.

## Installation

Since this addon is not yet published on AnkiWeb, it must be installed manually.

1. **Clone the repository**:

```bash
git clone https://github.com/solmarita/code-your-answer.git
``` 

2. **Locate your Anki addons folder**:
    - Open Anki, go to `Tools > Add-ons`.
    - Click `View Files` to open the `addons21` directory. 
3. **Copy the project folder** into `addons21/` (e.g., `addons21/code-your-answer/`).
4. **Restart Anki**.