import hljs from 'highlight.js/lib/core';

/**
 * LOADER REGISTRY
 * Groups all loaders for each language together
 */
const LOADER_REGISTRY = {
  // Standard CM 6 API Languages (Official & Community)
  python: {
    cm: () => import('@codemirror/lang-python'),
    hljs: () => import('highlight.js/lib/languages/python'),
  },
  javascript: {
    cm: () => import('@codemirror/lang-javascript'),
    hljs: () => import('highlight.js/lib/languages/javascript'),
  },
  typescript: {
    cm: () => import('@codemirror/lang-javascript'),
    hljs: () => import('highlight.js/lib/languages/typescript'),
  },
  java: {
    cm: () => import('@codemirror/lang-java'),
    hljs: () => import('highlight.js/lib/languages/java'),
  },
  cpp: {
    cm: () => import('@codemirror/lang-cpp'),
    hljs: () => import('highlight.js/lib/languages/cpp'),
  },
  c: {
    cm: () => import('@codemirror/lang-cpp'),
    hljs: () => import('highlight.js/lib/languages/c'),
  },
  php: {
    cm: () => import('@codemirror/lang-php'),
    hljs: () => import('highlight.js/lib/languages/php'),
  },
  go: {
    cm: () => import('@codemirror/lang-go'),
    hljs: () => import('highlight.js/lib/languages/go'),
  },
  rust: {
    cm: () => import('@codemirror/lang-rust'),
    hljs: () => import('highlight.js/lib/languages/rust'),
  },
  html: {
    cm: () => import('@codemirror/lang-html'),
    hljs: () => import('highlight.js/lib/languages/xml'),
  },
  css: {
    cm: () => import('@codemirror/lang-css'),
    hljs: () => import('highlight.js/lib/languages/css'),
  },
  json: {
    cm: () => import('@codemirror/lang-json'),
    hljs: () => import('highlight.js/lib/languages/json'),
  },
  yaml: {
    cm: () => import('@codemirror/lang-yaml'),
    hljs: () => import('highlight.js/lib/languages/yaml'),
  },
  markdown: {
    cm: () => import('@codemirror/lang-markdown'),
    hljs: () => import('highlight.js/lib/languages/markdown'),
  },
  sql: {
    cm: () => import('@codemirror/lang-sql'),
    hljs: () => import('highlight.js/lib/languages/sql'),
  },
  xml: {
    cm: () => import('@codemirror/lang-xml'),
    hljs: () => import('highlight.js/lib/languages/xml'),
  },
  wasm: {
    cm: () => import('@codemirror/lang-wast'),
    hljs: () => import('highlight.js/lib/languages/wasm'),
  },
  sass: {
    cm: () => import('@codemirror/lang-sass'),
    hljs: () => import('highlight.js/lib/languages/scss'),
  },
  less: {
    cm: () => import('@codemirror/lang-less'),
    hljs: () => import('highlight.js/lib/languages/less'),
  },
  vue: {
    cm: () => import('@codemirror/lang-vue'),
    hljs: () => import('highlight.js/lib/languages/xml'),
  },
  angular: {
    cm: () => import('@codemirror/lang-angular'),
    hljs: () => import('highlight.js/lib/languages/xml'),
  },
  csharp: {
    cm: () => import("@replit/codemirror-lang-csharp"),
    hljs: () => import('highlight.js/lib/languages/csharp'),
  },
  
  // Legacy Languages
  ruby: {
    cm: () => import('@codemirror/legacy-modes/mode/ruby'),
    hljs: () => import('highlight.js/lib/languages/ruby'),
  },
  swift: {
    cm: () => import('@codemirror/legacy-modes/mode/swift'),
    hljs: () => import('highlight.js/lib/languages/swift'),
  },
  r: {
    cm: () => import('@codemirror/legacy-modes/mode/r'),
    hljs: () => import('highlight.js/lib/languages/r'),
  },
  matlab: {
    cm: () => import('@codemirror/legacy-modes/mode/octave'),
    hljs: () => import('highlight.js/lib/languages/matlab'),
  },
  scala: {
    cm: () => import('@codemirror/legacy-modes/mode/clike'),
    hljs: () => import('highlight.js/lib/languages/scala'),
  },
  dart: {
    cm: () => import('@codemirror/legacy-modes/mode/clike'),
    hljs: () => import('highlight.js/lib/languages/dart'),
  },
  kotlin: {
    cm: () => import('@codemirror/legacy-modes/mode/clike'),
    hljs: () => import('highlight.js/lib/languages/kotlin'),
  },
  shell: {
    cm: () => import('@codemirror/legacy-modes/mode/shell'),
    hljs: () => import('highlight.js/lib/languages/bash'),
  },
};

/**
 * LANG ALIASES (Human-friendly)
 */
export const groupedAliases = {
  // Web Core
  javascript: ["js", "jsx", "node", "javascript", "ecmascript"],
  typescript: ["ts", "tsx", "typescript"],
  html: ["html", "htm"],
  css: ["css"],
  php: ["php", "php8", "php7"],
  xml: ["xml", "svg"],
  sass: ["sass", "scss"],
  less: ["less"],
  vue: ["vue"],
  angular: ["angular", "ng"],
  
  // Systems & General Purpose
  python: ["py", "py3", "python3", "python", "pypy"],
  rust: ["rs", "rustlang", "rust"],
  go: ["go", "golang"],
  zig: ["zig", "ziglang"],
  java: ["java", "jar"],
  cpp: ["cpp", "c++", "cc", "hpp", "h++"],
  c: ["c", "h"],
  csharp: ["cs", "csharp", "c#"],
  wasm: ["wasm", "wat"],
  
  // DevOps & Data
  shell: ["sh", "bash", "zsh", "shell", "batch", "ps1"],
  sql: ["sql", "mysql", "postgres", "psql"],
  yaml: ["yaml", "yml"],
  json: ["json"],
  markdown: ["md", "markdown"],
  
  // Niche & Modern
  swift: ["swift"],
  kotlin: ["kt", "kotlin"],
  dart: ["dart", "flutter"],
  ruby: ["rb", "ruby", "rails"],
  scala: ["scala"],
  r: ["r", "rscript"],
  matlab: ["matlab", "m"]
};

/**
 * GENERATED LANG ALIASES LOOKUP (Machine-friendly)
 */
export const aliases = {};
Object.entries(groupedAliases).forEach(([lang, tags]) => {
  tags.forEach(tag => {
    aliases[tag.toLowerCase()] = lang;
  });
});

/**
 * PRIVATE HELPER FUNCTIONS
 */

function registerHighlightJsGrammar(langName, grammar) {
  if (!hljs.getLanguage(langName)) {
    hljs.registerLanguage(langName, grammar);
  }
}

/**
 * Load a CodeMirror 6 language using the standard API
 * 
 * Works for both official @codemirror/* packages and community packages that follow
 * the CodeMirror 6 standard: exporting a language function with the same name as the
 * package that returns a LanguageSupport instance.
 * 
 * Example: @codemirror/lang-python exports python(), @replit/codemirror-lang-csharp
 * exports csharp() - both follow the same API pattern.
 * 
 * @param {string} langKey - Key in LOADER_REGISTRY
 * @param {string} cmExportName - Export name from CM package (e.g., 'python', 'csharp')
 * @param {string} hljsLangName - Language name for hljs registration
 * @param {string} displayName - Human-readable name
 * @param {Object} cmOptions - Optional CM language options
 */
async function loadCmLang(langKey, cmExportName, hljsLangName, displayName, cmOptions = {}) {
  const loaders = LOADER_REGISTRY[langKey];
  
  if (!loaders) {
    throw new Error(`No loaders found for: ${langKey}`);
  }
  
  const [cmModule, hljsModule] = await Promise.all([
    loaders.cm(),
    loaders.hljs()
  ]);
  
  const langFn = cmModule[cmExportName];
  const grammar = hljsModule.default;
  
  registerHighlightJsGrammar(hljsLangName, grammar);
  
  return {
    extension: langFn(cmOptions),
    name: displayName
  };
}

/**
 * Load a legacy CodeMirror mode via StreamLanguage
 * 
 * @param {string} langKey - Key in LOADER_REGISTRY
 * @param {string|null} modeName - Specific mode name if multi-mode file, null for first export
 * @param {string} hljsLangName - Language name for hljs registration
 * @param {string} displayName - Human-readable name
 */
async function loadCmLegacyLang(langKey, modeName, hljsLangName, displayName) {
  const loaders = LOADER_REGISTRY[langKey];
  
  if (!loaders) {
    throw new Error(`No loaders found for: ${langKey}`);
  }
  
  const [{ StreamLanguage }, cmModule, hljsModule] = await Promise.all([
    import("@codemirror/language"),
    loaders.cm(),
    loaders.hljs()
  ]);
  
  const grammar = hljsModule.default;
  registerHighlightJsGrammar(hljsLangName, grammar);
  
  const mode = modeName ? cmModule[modeName] : Object.values(cmModule)[0];
  
  return {
    extension: StreamLanguage.define(mode),
    name: displayName
  };
}

/**
 * PUBLIC API: Language Registry
 */
export const languageRegistry = {
  text: async () => ({ extension: [], name: "Plain Text" }),

  // Languages using CodeMirror 6 standard API (official @codemirror/* and compatible community packages e.g., csharp)
  c: () => loadCmLang('c', 'cpp', 'c', 'C'),
  cpp: () => loadCmLang('cpp', 'cpp', 'cpp', 'C++'),
  java: () => loadCmLang('java', 'java', 'java', 'Java'),
  python: () => loadCmLang('python', 'python', 'python', 'Python'),
  javascript: () => loadCmLang('javascript', 'javascript', 'javascript', 'JavaScript'),
  typescript: () => loadCmLang('typescript', 'javascript', 'typescript', 'TypeScript', { typescript: true }),
  php: () => loadCmLang('php', 'php', 'php', 'PHP'),
  go: () => loadCmLang('go', 'go', 'go', 'Go'),
  rust: () => loadCmLang('rust', 'rust', 'rust', 'Rust'),
  html: () => loadCmLang('html', 'html', 'xml', 'HTML'),
  css: () => loadCmLang('css', 'css', 'css', 'CSS'),
  json: () => loadCmLang('json', 'json', 'json', 'JSON'),
  yaml: () => loadCmLang('yaml', 'yaml', 'yaml', 'YAML'),
  markdown: () => loadCmLang('markdown', 'markdown', 'markdown', 'Markdown'),
  sql: () => loadCmLang('sql', 'sql', 'sql', 'SQL'),
  xml: () => loadCmLang('xml', 'xml', 'xml', 'XML'),
  wasm: () => loadCmLang('wasm', 'wast', 'wasm', 'WebAssembly'),
  sass: () => loadCmLang('sass', 'sass', 'scss', 'Sass'),
  less: () => loadCmLang('less', 'less', 'less', 'Less'),
  vue: () => loadCmLang('vue', 'vue', 'xml', 'Vue'),
  angular: () => loadCmLang('angular', 'angular', 'xml', 'Angular'),
  csharp: () => loadCmLang('csharp', 'csharp', 'csharp', 'C#'),
  
  // Legacy CodeMirror modes (pre-CM6)
  ruby: () => loadCmLegacyLang('ruby', null, 'ruby', 'Ruby'),
  swift: () => loadCmLegacyLang('swift', null, 'swift', 'Swift'),
  r: () => loadCmLegacyLang('r', null, 'r', 'R'),
  matlab: () => loadCmLegacyLang('matlab', null, 'matlab', 'MATLAB'),
  scala: () => loadCmLegacyLang('scala', null, 'scala', 'Scala'),
  dart: () => loadCmLegacyLang('dart', 'dart', 'dart', 'Dart'),
  kotlin: () => loadCmLegacyLang('kotlin', 'kotlin', 'kotlin', 'Kotlin'),
  shell: () => loadCmLegacyLang('shell', 'shell', 'bash', 'Shell'),
  
  // Community packages with non-standard API
  zig: async () => {
    const [{ LanguageSupport }, { lr }, zigGrammar] = await Promise.all([
      import("@codemirror/language"),
      import("@cookshack/codemirror-lang-zig"),
      import("highlightjs-zig")
    ]);
    
    // Register zig grammar (only runs when zig is actually used)
    if (!hljs.getLanguage("zig")) {
      hljs.registerLanguage("zig", zigGrammar.default);
    }
    
    return { extension: new LanguageSupport(lr), name: "Zig" };
  },
};