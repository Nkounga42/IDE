// src/components/EditorCommands.ts

/**
 * Définit un ou plusieurs thèmes personnalisés pour Monaco Editor.
 */
export const defineCustomThemes = (monaco: any) => {
  monaco.editor.defineTheme("custom-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955" },
      { token: "keyword", foreground: "C586C0" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "function", foreground: "DCDCAA" },
      { token: "variable", foreground: "9CDCFE" },
    ],
    colors: {
      "editor.background": "#1E1E1E",
      "editor.foreground": "#D4D4D4",
      "editorLineNumber.foreground": "#858585",
      "editorCursor.foreground": "#FFFFFF",
      "editor.lineHighlightBackground": "#333333",
    },
  });

  // Tu peux définir d'autres thèmes ici si besoin
};

/**
 * Liste des thèmes disponibles dans le select.
 */
export const themeOptions = [
  "vs-dark",
  "vs-light",
  "hc-black",
  "custom-dark",
];

/**
 * Liste des langages supportés par Monaco Editor (à adapter selon ton usage).
 */
export const languageOptions = [
  "javascript",
  "typescript",
  "html",
  "css",
  "json",
  "markdown",
  "python",
  "xml",
  "sql",
  "csharp",
  "cpp",
];
