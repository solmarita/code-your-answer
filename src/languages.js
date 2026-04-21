import hljs from 'highlight.js/lib/core';

/**
 * SOURCE OF TRUTH FOR LANG ALIASES (Human-friendly)
 */

export const groupedAliases = {
  javascript: ["js", "jsx", "node", "javascript"],
  python: ["py", "py3", "python3", "python"],
  rust: ["rs", "rustlang", "rust"],
};

/**
 * GENERATED LOOKUP (Machine-friendly)
 * Flattens the map once at runtime for O(1) performance.
 */
export const aliases = {};
Object.entries(groupedAliases).forEach(([lang, tags]) => {
  tags.forEach(tag => {
    aliases[tag.toLowerCase()] = lang;
  });
});

/**
 * Registry mapping keys to their specific language loading logic.
 * Uses destructuring for readability and modularity.
 */

export const languageRegistry = {
  // THIS IS THE MISSING PIECE
  text: async () => {
    return { extension: [], name: "Plain Text" };
  },
  
  python: async () => {
    // Dynamically import both packages in parallel
    const [{ python }, { default: pyGrammar }] = await Promise.all([
      import("@codemirror/lang-python"),
      import("highlight.js/lib/languages/python")
    ]);
    
    // Register the grammar for the Back-side beautifier
    if (!hljs.getLanguage('python')) hljs.registerLanguage('python', pyGrammar);
    
    return { extension: python(), name: "Python" };
  },

  javascript: async () => {
    const [{ javascript }, { default: jsGrammar }] = await Promise.all([
      import("@codemirror/lang-javascript"),
      import("highlight.js/lib/languages/javascript")
    ]);

    if (!hljs.getLanguage('javascript')) hljs.registerLanguage('javascript', jsGrammar);
    
    return { extension: javascript(), name: "JavaScript" };
  }
};