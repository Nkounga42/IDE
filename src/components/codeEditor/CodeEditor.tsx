// src/components/CodeEditor.tsx
import { Editor } from "@monaco-editor/react";
import React, { useRef, useState } from "react";
import { defineCustomThemes } from "./EditorCommands";
import EditorToolbar from "./EditorUI/EditorToolbar";

const CodeEditor = () => {
  const monacoRef = useRef<any>(null);
  const [theme, setTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("javascript");

  const handleEditorWillMount = (monaco: any) => {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    defineCustomThemes(monaco);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    monacoRef.current = monaco;
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <EditorToolbar
        theme={theme}
        language={language}
        onThemeChange={(t) => {
          setTheme(t);
          monacoRef.current?.editor.setTheme(t);
        }}
        onLanguageChange={(l) => setLanguage(l)}
      />

      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={language}
          defaultValue="// Écris ton code ici"
          theme={theme}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
