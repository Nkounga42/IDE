import  { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

const CodeEditor = ({code, language}) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        editorRef.current?.layout();
      });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
        <Editor
          height="100%"
          width="100%"
          defaultLanguage={language || 'text'}
          value={code}
          theme="wireframe"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("wireframe", {
              base: "vs-dark",
              inherit: true,
              rules: [
                { token: "", foreground: "F2EDED", background: "002D2C" },
                { token: "comment", foreground: "748DA6", fontStyle: "italic" },
                { token: "keyword", foreground: "96BB7C", fontStyle: "bold" },
                { token: "number", foreground: "FFB347" },
                { token: "string", foreground: "A1C8F0" },
                { token: "operator", foreground: "C5D86D" },
                { token: "identifier", foreground: "E1E4E8" },
                { token: "delimiter", foreground: "7E8AA2" },
                { token: "type", foreground: "A3D2CA", fontStyle: "underline" },
                { token: "function", foreground: "FFD966" },
                { token: "variable", foreground: "C9D6DF" },
                { token: "class", foreground: "8FB339" },
                { token: "constant", foreground: "F4989D" },
                { token: "tag", foreground: "FF7F50" },
                { token: "attribute.name", foreground: "FFD700" },
                { token: "attribute.value", foreground: "C5E99B" },
              ],
              colors: {
                "editor.background": "#002D2C",
                "editor.foreground": "#F2EDED",
                "editorCursor.foreground": "#96BB7C",
                "editor.lineHighlightBackground": "#263238",
                "editorLineNumber.foreground": "#7E8AA2",
                "editor.selectionBackground": "#425C5A80",
                "editor.inactiveSelectionBackground": "#425C5A40",
                "editorIndentGuide.background": "#425C5A30",
                "editorIndentGuide.activeBackground": "#96BB7C80",
                "editorWhitespace.foreground": "#7E8AA240",
                "editorBracketMatch.background": "#8FB33940",
                "editorBracketMatch.border": "#8FB339",
                "editorError.foreground": "#F4989D",
                "editorWarning.foreground": "#FFD966",
                "editorInfo.foreground": "#A1C8F0",
              },
            });
          }}
          onMount={(editor) => {
            editorRef.current = editor;
            setTimeout(() => editor.layout(), 0); // Force layout initial
          }}
          options={{
            automaticLayout: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
