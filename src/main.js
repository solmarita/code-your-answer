import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

import { oneDark } from "@codemirror/theme-one-dark";

import { keymap, showPanel } from "@codemirror/view";
import { closeBrackets } from "@codemirror/autocomplete";
import { bracketMatching } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete"

import * as Diff from 'diff';

import "./style.css"

/* ---- HELPERS & REGISTRY ---- */

const STORAGE_KEY = 'cya_editor_content';

/**
 * Strips Anki's HTML formatting to get raw code for the diff engine.
 */
function htmlToPlainText(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

/**
 * Registry mapping keys to their specific language loading logic.
 * Uses destructuring for readability and modularity.
 */
const languageRegistry = {
  javascript: async () => {
    const { javascript } = await import("@codemirror/lang-javascript");
    return { extension: javascript(), name: "JavaScript" };
  },

  python: async () => {
    const { python } = await import("@codemirror/lang-python");
    return { extension: python(), name: "Python" };
  },

  text: async () => ({
    extension: [], 
    name: "Plain Text"
  }),
};

/**
 * Alias mapping for user convenience.
 */
const aliases = {
  js: "javascript",
  jsx: "javascript",
  py: "python",
  py3: "python",
};

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

  const lowerLang = lang.toLowerCase();
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
      basicSetup,           // Includes essential features like line numbers and history
      oneDark,              // Sets the visual dark theme
      extension,    // Applies syntax highlighting for the selected language
      showPanel.of(languageBadge(name)), // Adds the language label to the bottom
      closeBrackets(),      // Automatically closes (), [], and {}
      bracketMatching(),    // Highlights matching brackets
      keymap.of([indentWithTab]), // Allows using the Tab key to indent
      autocompletion({ override: [] }), // Disables autocomplete

      // Sync editor state to sessionStorage for downstream diffing
        EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          sessionStorage.setItem(STORAGE_KEY, update.state.doc.toString());
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

// ----------------- DIFF -------------------//

/**
 * Inline Diff Logic
 * Green: Correct (Match)
 * Red: Missing (Was in Solution, but User missed it)
 * Blue: Extra (User typed it, but it wasn't expected)
 */
function renderCyaDiff(correctCodeHTML, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const typedInput = sessionStorage.getItem(STORAGE_KEY) || "";
  const solution = htmlToPlainText(correctCodeHTML);

  // We compare User Attempt (Old) vs Solution (New)
  const diff = Diff.diffChars(typedInput.trimEnd(), solution.trimEnd());

  let html = '<div class="cya-diff-inline">';

  diff.forEach((part) => {
    if (!part.added && !part.removed) {
      // 1. GREEN: Both in expected and user typed.
      html += `<span class="diff-match">${part.value}</span>`;
    } 
    else if (part.added) {
      // 2. RED: In expected answer, but missing in user answer.
      // (Added to the solution relative to the user's input)
      html += `<span class="diff-missed">${part.value}</span>`;
    } 
    else if (part.removed) {
      // 3. BLUE: In user typed but not in expected.
      // (Removed from the user's input to get to the solution)
      html += `<span class="diff-extra">${part.value}</span>`;
    }
  });

  html += '</div>';
  target.innerHTML = html;
}

// Ensure the Back template can find the function
window.renderCyaDiff = renderCyaDiff;