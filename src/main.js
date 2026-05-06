import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

import { oneDark } from "@codemirror/theme-one-dark";
import * as bundleThemes from "@fsegurai/codemirror-theme-bundle";

import { keymap, showPanel } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
import { indentUnit } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";

import * as Diff from 'diff';

/**
**HLJS
**/

import hljs from 'highlight.js/lib/core';
import plaintext from 'highlight.js/lib/languages/plaintext';
hljs.registerLanguage('plaintext', plaintext); //Register plaintext immediately as the fallback

/**
 * languages.js & custom styles.css
 */

import {groupedAliases, aliases, languageRegistry } from './languages.js';

import "./style.css";

const STORAGE_KEY = 'cya_editor_content';

// THEMEING

/**
 * Anki light/dark mode
 */

const isAnkiNightMode = () => {
  return document.body.classList.contains('nightMode') || 
         document.documentElement.classList.contains('nightMode');
};

const getActiveTheme = () => {
  return isAnkiNightMode() ? "dark" : "light";
};

const ankiThemeMode = getActiveTheme();

/**
 * Code Mirror Theme
 */

const ALL_CM_THEMES = Object.fromEntries(
  Object.entries(bundleThemes).filter(([key]) => !key.endsWith("MergeStyles"))
);

const CM_THEMES = {
  light: bundleThemes.githubLight,
  dark: oneDark,
};

const userThemeName = window.CYA_CONFIG?.theme;
const activeTheme = (userThemeName && ALL_CM_THEMES[userThemeName])
  ? ALL_CM_THEMES[userThemeName]
  : CM_THEMES[ankiThemeMode];

/**
 * HLJS Theme
 */

const HLJS_THEMES = {
  light: "github",
  dark: "atom-one-dark",
};

const applyHljsTheme = async (theme) => {
  if (theme === "dark") {
    await import('highlight.js/styles/atom-one-dark.css');
  } else {
    await import('highlight.js/styles/github.css');
  }
};

applyHljsTheme(ankiThemeMode);

// LANGUAGE HANDLING

/**
* Resolves a language string into a CodeMirror extension and display name.
* @param {string} lang - The raw language input.
 */
async function getLanguageExtension(lang) {
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
    name: `${lang.toUpperCase()}: Language Not Supported!: Plain Text Mode` 
  };
}

// SETTING UP THE EDITOR

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
    
    // Status-based coloring if a language is unsupported
    if (isUnsupported) {
      dom.style.background = "#DC3545";
      dom.style.color = "#ffffff";
      dom.style.border = "1px solid #b02a37";
    }
    
    return { dom, top: false };
  };
}

function buildUserExtensions(cfg) {
  const exts = [];
  exts.push(indentUnit.of(" ".repeat(cfg.indentUnit ?? 4)));
  if (cfg.indentWithTab  !== false) exts.push(keymap.of([indentWithTab]));
  exts.push(cfg.autocompletion ? autocompletion() : autocompletion({ override: [] }));
  // Future extensions (e.g. vim): if (cfg.vim) exts.push(vim());
  return exts;
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

      // CORE EXTENSIONS

      basicSetup,
      activeTheme,
      extension,
      showPanel.of(languageBadge(name)),

      // USER-CONFIGURED EXTENSIONS

      ...buildUserExtensions(window.CYA_CONFIG ?? {}),
      
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

// ANKI BACKSIDE LOGIC

/**
 * Strips Anki/Obsidian (if using Obsidian_to_Anki) HTML and normalizes line endings
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
 * Green: Match | Grey: Omission | Red: Extra
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

/**
 * Make sure all languages listed in groupedAliases have an entry in languageRegistry
 * For use during development
 */

const registryKeys = new Set(Object.keys(languageRegistry));

Object.entries(groupedAliases).forEach(([lang, tags]) => {
  if (!registryKeys.has(lang)) {
    console.warn(`Missing languageRegistry handler for: ${lang}`);
  }
});