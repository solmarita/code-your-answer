import hljs from 'highlight.js/lib/core';
import zigGrammar from "highlightjs-zig";

// register zig grammar
hljs.registerLanguage("zig", zigGrammar);

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
  
  // Systems & General Purpose
  python: ["py", "py3", "python3", "python", "pypy"],
  rust: ["rs", "rustlang", "rust"],
  go: ["go", "golang"],
  zig: ["zig", "ziglang"],
  java: ["java", "jar"],
  cpp: ["cpp", "c++", "cc", "hpp", "h++"],
  c: ["c", "h"],
  csharp: ["cs", "csharp", "c#"],
  
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
  text: async () => ({ extension: [], name: "Plain Text" }),

  c: async () => {
  const [{ cpp }, { default: grammar }] = await Promise.all([
    import("@codemirror/lang-cpp"),
    import("highlight.js/lib/languages/c")
  ]);
  if (!hljs.getLanguage('c')) hljs.registerLanguage('c', grammar);
  return { extension: cpp(), name: "C" };
  },

  cpp: async () => {
    const [{ cpp }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-cpp"),
      import("highlight.js/lib/languages/cpp")
    ]);
    if (!hljs.getLanguage('cpp')) hljs.registerLanguage('cpp', grammar);
    return { extension: cpp(), name: "C++" };
  },

  java: async () => {
    const [{ java }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-java"),
      import("highlight.js/lib/languages/java")
    ]);
    if (!hljs.getLanguage('java')) hljs.registerLanguage('java', grammar);
    return { extension: java(), name: "Java" };
  },

  python: async () => {
    const [{ python }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-python"),
      import("highlight.js/lib/languages/python")
    ]);
    if (!hljs.getLanguage('python')) hljs.registerLanguage('python', grammar);
    return { extension: python(), name: "Python" };
  },

  javascript: async () => {
    const [{ javascript }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-javascript"),
      import("highlight.js/lib/languages/javascript")
    ]);
    if (!hljs.getLanguage('javascript')) hljs.registerLanguage('javascript', grammar);
    return { extension: javascript(), name: "JavaScript" };
  },

  typescript: async () => {
    const [{ javascript }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-javascript"),
      import("highlight.js/lib/languages/typescript")
    ]);
    if (!hljs.getLanguage('typescript')) hljs.registerLanguage('typescript', grammar);
    return { extension: javascript({ typescript: true }), name: "TypeScript" };
  },

  php: async () => {
    const [{ php }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-php"),
      import("highlight.js/lib/languages/php")
    ]);
    if (!hljs.getLanguage('php')) hljs.registerLanguage('php', grammar);
    return { extension: php(), name: "PHP" };
  },

  go: async () => {
    const [{ go }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-go"),
      import("highlight.js/lib/languages/go")
    ]);
    if (!hljs.getLanguage('go')) hljs.registerLanguage('go', grammar);
    return { extension: go(), name: "Go" };
  },

  rust: async () => {
    const [{ rust }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-rust"),
      import("highlight.js/lib/languages/rust")
    ]);
    if (!hljs.getLanguage('rust')) hljs.registerLanguage('rust', grammar);
    return { extension: rust(), name: "Rust" };
  },

  html: async () => {
    const [{ html }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-html"),
      import("highlight.js/lib/languages/xml")
    ]);
    if (!hljs.getLanguage('xml')) hljs.registerLanguage('xml', grammar);
    return { extension: html(), name: "HTML" };
  },

  css: async () => {
    const [{ css }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-css"),
      import("highlight.js/lib/languages/css")
    ]);
    if (!hljs.getLanguage('css')) hljs.registerLanguage('css', grammar);
    return { extension: css(), name: "CSS" };
  },

  json: async () => {
    const [{ json }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-json"),
      import("highlight.js/lib/languages/json")
    ]);
    if (!hljs.getLanguage('json')) hljs.registerLanguage('json', grammar);
    return { extension: json(), name: "JSON" };
  },

  yaml: async () => {
    const [{ yaml }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-yaml"),
      import("highlight.js/lib/languages/yaml")
    ]);
    if (!hljs.getLanguage('yaml')) hljs.registerLanguage('yaml', grammar);
    return { extension: yaml(), name: "YAML" };
  },

  markdown: async () => {
    const [{ markdown }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-markdown"),
      import("highlight.js/lib/languages/markdown")
    ]);
    if (!hljs.getLanguage('markdown')) hljs.registerLanguage('markdown', grammar);
    return { extension: markdown(), name: "Markdown" };
  },

  sql: async () => {
    const [{ sql }, { default: grammar }] = await Promise.all([
      import("@codemirror/lang-sql"),
      import("highlight.js/lib/languages/sql")
    ]);
    if (!hljs.getLanguage('sql')) hljs.registerLanguage('sql', grammar);
    return { extension: sql(), name: "SQL" };
  },
  
  // Community Supported Languages

    csharp: async () => {
    const [{ csharp }, { default: grammar }] = await Promise.all([
      import("@replit/codemirror-lang-csharp"),
      import("highlight.js/lib/languages/csharp")
    ]);

    if (!hljs.getLanguage("csharp")) {
      hljs.registerLanguage("csharp", grammar);
    }

    return {
      extension: csharp(),
      name: "C#"
    };
  },

  zig: async () => {
    const [{ LanguageSupport }, { lr }] = await Promise.all([
      import("@codemirror/language"),
      import("@cookshack/codemirror-lang-zig")
    ]);

    return {
      extension: new LanguageSupport(lr),
      name: "Zig"
    };
  },

  // Legacy Language Support

  ruby: async () => {
    const [{ StreamLanguage }, modeModule, { default: grammar }] =
      await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/ruby"),
        import("highlight.js/lib/languages/ruby")
      ]);

    if (!hljs.getLanguage("ruby")) hljs.registerLanguage("ruby", grammar);

    const mode = Object.values(modeModule)[0];

    return {
      extension: StreamLanguage.define(mode),
      name: "Ruby"
    };
  },

  swift: async () => {
    const [{ StreamLanguage }, modeModule, { default: grammar }] =
      await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/swift"),
        import("highlight.js/lib/languages/swift")
      ]);

    if (!hljs.getLanguage("swift")) hljs.registerLanguage("swift", grammar);

    const mode = Object.values(modeModule)[0];

    return {
      extension: StreamLanguage.define(mode),
      name: "Swift"
    };
  },

  r: async () => {
    const [{ StreamLanguage }, modeModule, { default: grammar }] =
      await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/r"),
        import("highlight.js/lib/languages/r")
      ]);

    if (!hljs.getLanguage("r")) hljs.registerLanguage("r", grammar);

    const mode = Object.values(modeModule)[0];

    return {
      extension: StreamLanguage.define(mode),
      name: "R"
    };
  },

  matlab: async () => {
    const [{ StreamLanguage }, modeModule, { default: grammar }] =
      await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/octave"),
        import("highlight.js/lib/languages/matlab")
      ]);

    if (!hljs.getLanguage("matlab")) hljs.registerLanguage("matlab", grammar);

    const mode = Object.values(modeModule)[0];

    return {
      extension: StreamLanguage.define(mode),
      name: "MATLAB"
    };
  },

  scala: async () => {
    const [{ StreamLanguage }, modeModule, { default: grammar }] =
      await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/clike"),
        import("highlight.js/lib/languages/scala")
      ]);

    if (!hljs.getLanguage("scala")) hljs.registerLanguage("scala", grammar);

    const mode = Object.values(modeModule)[0];

    return {
      extension: StreamLanguage.define(mode),
      name: "Scala"
    };
  },

  dart: async () => {
    const [{ StreamLanguage }, modeModule, { default: grammar }] =
      await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/clike"),
        import("highlight.js/lib/languages/dart")
      ]);

    if (!hljs.getLanguage("dart")) hljs.registerLanguage("dart", grammar);

    return {
      extension: StreamLanguage.define(modeModule.dart),
      name: "Dart"
    };
  },

  kotlin: async () => {
    const [{ StreamLanguage }, modeModule, { default: grammar }] =
      await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/clike"),
        import("highlight.js/lib/languages/kotlin")
      ]);

    if (!hljs.getLanguage("kotlin")) {
      hljs.registerLanguage("kotlin", grammar);
    }

    return {
      extension: StreamLanguage.define(modeModule.kotlin),
      name: "Kotlin"
    };
  },

  shell: async () => {
    const [{ StreamLanguage }, modeModule, { default: grammar }] =
      await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/shell"),
        import("highlight.js/lib/languages/bash")
      ]);

    if (!hljs.getLanguage("bash")) {
      hljs.registerLanguage("bash", grammar);
    }

    return {
      extension: StreamLanguage.define(modeModule.shell),
      name: "Shell"
    };
  },
};