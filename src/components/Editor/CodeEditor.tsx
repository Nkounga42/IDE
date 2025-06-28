import React, { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";

const CodeEditor = ({
  code = "",
  setCharCount = () => {},
  language = "javascript",
  theme = "vs-dark",
  onContentChange = () => {},
}) => {
  const monacoRef = useRef(null);

  const handleEditorWillMount = (monaco) => {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = monaco;
    setCharCount(editor.getValue().length);
  };

  const handleEditorChange = (value) => {
    setCharCount(value ? value.length : 0);
    onContentChange(value);
  };

  return (
    <Editor
      height="100%"
      width="99.95%"
      language={language}
      value={code}
      theme={ /*theme || */"vs-dark"}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      onChange={handleEditorChange} // <-- écoute les changements
    />
  );
};

export default CodeEditor;
