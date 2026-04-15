import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

import { oneDark } from "@codemirror/theme-one-dark";

import { keymap, showPanel } from "@codemirror/view";
import { closeBrackets } from "@codemirror/autocomplete";
import { bracketMatching } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete"

import "./style.css"

/**
 * A list of supported languages for the editor.
 * * Each "key" (like 'python') is the name typed in Anki's card Language field.
 * The function inside loads the necessary code for the specified language only when it's needed.
 */
const languageRegistry = {
  javascript: async () => {
    const { javascript } = await import("@codemirror/lang-javascript");
    return javascript();
  },

  python: async () => {
    const { python } = await import("@codemirror/lang-python");
    return python();
  },

  // If no language is found, we use this as the default/plain text setting.
  text: async () => [],
};

/**
 * Looks for the specified language. 
 * If it doesn't find it (or if the field is empty), it returns the 'text' version.
 */
async function getLanguageExtension(lang) {
  // Check if the language exists; if not, use the 'text' default
  const loader = languageRegistry[lang] || languageRegistry.text;
  
  // Run the loader to get the code for that language
  return await loader();
}

/**
 * Creates the small language label at the bottom of the editor.
 * * @param {string} lang - The language name to display.
 */
function languageBadge(lang) {
  return (view) => {
    let dom = document.createElement("div");
    dom.className = "cm-language-badge";
    dom.textContent = `> ${lang.toUpperCase()}`; // Makes the text uppercase (e.g., '> PYTHON')
    
    // Simple styles for the label
    dom.style.padding = "4px 8px";
    dom.style.background = "#21252b";
    dom.style.color = "#abb2bf";
    dom.style.fontSize = "12px";
    dom.style.fontWeight = "bold";
    dom.style.borderBottom = "1px solid #444";

    // "top: false" makes sure it stays at the bottom of the editor
    return { dom, top: false };
  };
}

/**
 * The main function to set up your CodeMirror editor.
 * @param {string} lang - The language name (e.g., 'python') passed from Anki's template.
 */
async function createEditor(lang) {
  // Find the HTML div where the editor should live
  const parent = document.getElementById("editor");
  
  // Stop if the editor container is missing or if the editor is already running
  if (!parent || parent.querySelector(".cm-editor")) return;

  // Ask the language registry to find the right syntax highlighting for the specified language
  const languageExtension = await getLanguageExtension(lang);
  
  // Set up the editor's configuration
  const state = EditorState.create({
    extensions: [
      basicSetup,           // Includes essential features like line numbers and history
      oneDark,              // Sets the visual dark theme
      languageExtension,    // Applies syntax highlighting for the selected language
      showPanel.of(languageBadge(lang)), // Adds the language label to the bottom
      closeBrackets(),      // Automatically closes (), [], and {}
      bracketMatching(),    // Highlights matching brackets
      keymap.of([indentWithTab]), // Allows using the Tab key to indent
      autocompletion({ override: [] }), // Disables autocomplete
      
      // Forces the editor to be 400px tall and styles the bottom panel
      EditorView.theme({
        "&": { height: "400px" },
        ".cm-panels-bottom": { borderTop: "1px solid #444 !important" }
      })
    ],
  });

  // Finally, render the editor into the HTML container
  new EditorView({
    state,
    parent: parent,
  });
}

// Attach to the window object so the template can find it
window.initCyaEditor = createEditor;