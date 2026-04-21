import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

import { oneDark } from "@codemirror/theme-one-dark";

import { keymap, showPanel } from "@codemirror/view";
import { closeBrackets } from "@codemirror/autocomplete";
import { bracketMatching, indentUnit } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete"

import * as Diff from 'diff';

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';
import plaintext from 'highlight.js/lib/languages/plaintext';
hljs.registerLanguage('plaintext', plaintext); //Register plaintext immediately as the fallback

import { aliases, languageRegistry } from './languages.js';

import "./style.css";

const STORAGE_KEY = 'cya_editor_content';

/**
* Resolves a language string into a CodeMirror extension and display name.
* @param {string} lang - The raw language input.
 */
async function getLanguageExtension(lang) {
  // If lang is empty/null, return the "No Language" state immediately
  if (!lang) {
    const fallback = await languageRegistry.text();
    return { ...fallback, name: "No Language: Plain Text Mode" };
  }

  const lowerLang = (lang || "").toLowerCase().trim();
  const resolvedKey = aliases[lowerLang] || lowerLang;
  const loader = languageRegistry[resolvedKey];
  
  if (loader && typeof loader === 'function') {
    return await loader();
  }

  // Handle Unsupported languages
  const fallback = await languageRegistry.text();
  return { 
    ...fallback, 
    name: `${lang.toUpperCase()}: Language Not Supported!` 
  };
}

/**
 * Creates a panel badge to display the active language/mode.
 * @param {string} name - The status string from getLanguageExtension.
 */
function languageBadge(name) {
  return (view) => {
    const isUnsupported = name.includes("Not Supported");
    
    let dom = document.createElement("div");
    dom.className = "cm-language-badge";
    dom.textContent = `> ${name}`;
    
    // Styling
    dom.style.padding = "4px 8px";
    dom.style.fontSize = "12px";
    dom.style.fontWeight = "bold";
    
    // Status-based coloring
    dom.style.background = isUnsupported ? "#5e2121" : "#21252b";
    dom.style.color = isUnsupported ? "#ff8e8e" : "#abb2bf";
    
    return { dom, top: false };
  };
}

/**
 * Initializes the CodeMirror editor with the specified language.
 * @param {string} lang - The language identifier from the Anki field.
 */
async function createEditor(lang) {
  const parent = document.getElementById("editor");
  if (!parent || parent.querySelector(".cm-editor")) return;

  // Clear any old data when the editor first loads to ensure a fresh start
  sessionStorage.removeItem("cya_editor_content");

  // Everything is neatly resolved here
  const { extension, name } = await getLanguageExtension(lang);
  
  const state = EditorState.create({
    extensions: [
      // CUSTOM COMMANDS FIRST
      keymap.of([
        {
          key: "Ctrl-Enter",
          run: (view) => {
            // Direct call to Anki's bridge for showing the answer
            if (typeof pycmd !== "undefined") {
                pycmd("ans");
            } else {
                // Fallback for web-based testing
                const btn = document.getElementById("ansbutton");
                if (btn) btn.click();
            }
            return true; 
          }
        },
        {
          key: "Cmd-Enter",
          run: (view) => {
            if (typeof pycmd !== "undefined") pycmd("ans");
            return true;
          }
        }
      ]),

      // DEFAULT COMMANDS SECOND

      basicSetup,           // Includes essential features like line numbers and history
      oneDark,              // Sets the visual dark theme
      extension,    // Applies syntax highlighting for the selected language
      indentUnit.of("    "), // Set default indent unit to 4 spaces
      showPanel.of(languageBadge(name)), // Adds the language label to the bottom
      closeBrackets(),      // Automatically closes (), [], and {}
      bracketMatching(),    // Highlights matching brackets
      keymap.of([indentWithTab]), // Allows using the Tab key to indent
      autocompletion({ override: [] }), // Disables autocomplete
      // Sync editor state to sessionStorage for downstream diffing
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const currentText = update.state.doc.toString();
          sessionStorage.setItem(STORAGE_KEY, currentText);
        }
      }),

      // Forces the editor to be 400px tall and styles the bottom panel
      EditorView.theme({
        "&": { height: "400px" },
        ".cm-panels-bottom": { borderTop: "1px solid #444 !important" }
      })
    ],
  });

  new EditorView({ state, parent });
}

// Attach to the window object so the template can find it
window.initCyaEditor = createEditor;


/**
 * Strips Anki/Obsidian HTML and normalizes line endings
 */
function htmlToPlainText(html) {
  const temp = document.createElement("div");
  let processed = html.replace(/<\/div>|<div>/gi, '\n')
                      .replace(/<br\s*\/?>/gi, '\n');
  temp.innerHTML = processed;
  return temp.textContent || temp.innerText || "";
}

/**
 * DIFF ENGINE
 * Green: Match | Red: Missed (In solution) | Blue: Extra (In typed)
 */

function renderCyaDiff(correctCodeHTML, diffTargetId, answerTargetId, attemptTargetId, lang) {
  const diffTarget = document.getElementById(diffTargetId);
  const answerTarget = document.getElementById(answerTargetId);
  const attemptTarget = document.getElementById(attemptTargetId);
  
  const typedInput = sessionStorage.getItem("cya_editor_content") || "";
  
  // Clean the solution HTML
  const temp = document.createElement("div");
  let processed = correctCodeHTML.replace(/<\/div>|<div>/gi, '\n').replace(/<br\s*\/?>/gi, '\n');
  temp.innerHTML = processed;
  const solution = (temp.textContent || temp.innerText || "").trimEnd();

  // 1. Render the Diff
  const diff = Diff.diffChars(typedInput.trimEnd(), solution);
  let diffHtml = '<div class="cya-diff-inline">';
  diff.forEach((part) => {
    if (!part.added && !part.removed) {
      diffHtml += `<span class="diff-match">${part.value}</span>`;
    } else if (part.added) {
      diffHtml += `<span class="diff-missed">${part.value}</span>`;
    } else if (part.removed) {
      diffHtml += `<span class="diff-extra">${part.value}</span>`;
    }
  });
  diffHtml += '</div>';
  if (diffTarget) diffTarget.innerHTML = diffHtml;

  // Helper for highlighting
  const highlightCode = (code) => {
    try {
      const targetLang = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language: targetLang }).value;
    } catch (e) {
      return hljs.highlightAuto(code).value;
    }
  };

  // 2. Render Beautified User Attempt
  if (attemptTarget) {
    const highlightedAttempt = highlightCode(typedInput.trimEnd() || "# No input detected");
    attemptTarget.innerHTML = `<pre><code class="hljs">${highlightedAttempt}</code></pre>`;
  }

  // 3. Render Beautified Expected Answer
  if (answerTarget) {
    const highlightedSolution = highlightCode(solution);
    answerTarget.innerHTML = `<pre><code class="hljs">${highlightedSolution}</code></pre>`;
  }
}

// Export to window for access from the Anki Template
window.renderCyaDiff = renderCyaDiff;
