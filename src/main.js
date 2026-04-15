import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

import { oneDark } from "@codemirror/theme-one-dark";

import { keymap } from "@codemirror/view";
import { closeBrackets } from "@codemirror/autocomplete";
import { bracketMatching } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete"

import "./style.css"

/**
 * LANGUAGE REGISTRY
 * Each entry is a loader function that:
 * 1. dynamically imports the language package
 * 2. returns the CodeMirror extension
 */
const languageRegistry = {
  javascript: async () => {
    const mod = await import("@codemirror/lang-javascript");
    return mod.javascript();
  },

  python: async () => {
    const mod = await import("@codemirror/lang-python");
    return mod.python();
  },

  // ─────────────────────────────
  // Fallback template (for future languages)
  // If a package doesn’t expose `mod.lang()`,
  // you can handle it like this:
  //
  // sql: async () => {
  //   const mod = await import("@codemirror/lang-sql");
  //   return mod.sqlLanguage; // or LanguageSupport wrapper
  // },
  // ─────────────────────────────
};

/**
 * Loads the language extension safely
 */
async function getLanguageExtension(lang) {
  const loader = languageRegistry[lang];

  if (!loader) return [];

  return await loader();
}

/**
 * MAIN APP
 */
async function main() {
  const currentLanguage = "python"; // change to your language, e.g., "javascript"

  const languageExtension = await getLanguageExtension(currentLanguage);

  const state = EditorState.create({
    doc: "print('Hello, World!');",
    extensions: [
      basicSetup,
      languageExtension,
      oneDark,
      closeBrackets(),
      bracketMatching(),
      keymap.of([indentWithTab]),
      autocompletion({ override: [] }), // Disable autocompletion by providing an empty array as override 
    ],
  });

  new EditorView({
    state,
    parent: document.getElementById("editor"),
  });
}

main();