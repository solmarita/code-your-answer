# Code Your Answer

An Anki addon for practicing coding flashcards by typing answers in an IDE-style input field and comparing them against a predefined solution upon submission.

## Features

- Creates a custom **"Code Your Answer"** note type with predefined fields:
    - **Front**: Question 
    - **Back**: Expected code answer only (any additional explanation should go in Back Extra)
    - **Back Extra**: Additional context or clarification for the answer
    - **Language**: Editor language used for code input
- Adds an IDE-style input field for writing coding answers on the front of cards.
- Includes a built-in comparison system to evaluate typed answers against expected solutions.

## Development

**DISCLAIMER:** This addon is under active development and may change frequently!

## Installation

Since this addon is not yet published on AnkiWeb, it must be installed manually.

1. Download or clone this repository:
  ```bash
  git clone https://github.com/solmarita/code-your-answer.git
  ```
2. Locate your Anki addons folder:
    - Open Anki, go to `Tools > Add-ons` menu.
    - Click `View Files`, Anki will open the top-level `addons21` directory.
    - If an add-on is selected, Anki may open that add-on’s folder instead — in that case, go up one level to reach the main `addons21` directory.
    - Typical addon folder locations
        - **Linux:** `~/.local/share/Anki2/addons21/` 
        - **macOS:** `~/Library/Application Support/Anki2/addons21/`
        - **Windows:** `%APPDATA%\Anki2\addons21\`
3. Copy the project folder into `addons21/` (i.e., `addons21/code-your-answer/`).
4. Restart Anki.
5. The addon will initialize automatically on startup.

