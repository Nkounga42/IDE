import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";

const CodeEditor = ({
  code = "",
  language = "javascript",
  onChange,
  fontSize
}) => {

 

  // Injection du thème Dracula avant montage
  const editorWillMount = (monaco) => {
    monaco.editor.defineTheme("dracula", {
      base: "vs-dark",
      inherit: true,
      rules: [{ background: "282a36" }],
      colors: {
        "editor.foreground": "#F8F8F2",
        "editor.background": "#272822",
        "editor.selectionBackground": "#49483E",
        "editor.lineHighlightBackground": "#3E3D32",
        "editorCursor.foreground": "#F8F8F0",
        "editorWhitespace.foreground": "#3B3A32",
        "editorIndentGuide.activeBackground": "#9D550FB0",
        "editor.selectionHighlightBorder": "#222218",
      },
    });
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <MonacoEditor 
        language={language} // ✅ corrigé ici
        theme="dracula"
        value={code}
        onChange={onChange} // ✅ ajout ici
        editorWillMount={editorWillMount}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize, //14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          
        }}
      />
    </div>
  );
};

export default CodeEditor;


 