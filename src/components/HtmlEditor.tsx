import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; 
import "prismjs/components/prism-markup"; // HTML

interface HtmlEditorProps {
  lineNumbers?: string[];
  setLineNumbers: (lines: string[]) => void;
  Language: string;
  code: string;
  setCode: (code: string) => void;
  fontSize: number;
  setCursorCol: (col: number) => void;
  setCursorLine: (line: number) => void;
  setCharCount: (count: number) => void;
  cursorLine: number;
  cursorCol: number;
  onContentChange?: () => void;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({
  lineNumbers = [],
  setLineNumbers,
  Language,
  code,
  setCode,
  fontSize,
  setCursorCol,
  setCursorLine,
  setCharCount,
  cursorLine,
  cursorCol,
  onContentChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const codeHighlightRef = useRef<HTMLPreElement>(null);
  const [focused, setFocused] = useState<number[]>([]);

  useEffect(() => {
    const defaultCode = `<!DOCTYPE html>
<html>
<head>
    <title>Mon Document</title>
</head>
<body>
    <h1>Bonjour le monde !</h1>
    <p>Ceci est un paragraphe.</p>
</body>
</html>`;
    setCode(code || defaultCode);
    updateLineNumbers(code || defaultCode);
  }, []);

  useEffect(() => {
    // À chaque changement de code, on met à jour le contenu coloré
    if (codeHighlightRef.current) {
      // Prism.highlight(code, Prism.languages[Language], Language) renvoie le code HTML coloré
      codeHighlightRef.current.innerHTML = Prism.highlight(
        code,
        Prism.languages[Language] || Prism.languages.markup,
        Language
      );
    }
  }, [code, Language]);

  const updateLineNumbers = (text: string) => {
    const lines = text.split("\n");
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => (i + 1).toString()));
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current && codeHighlightRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      codeHighlightRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCharCount(value.length);
    setCode(value);
    updateLineNumbers(value);
    updateCursorPosition();
    if (onContentChange) onContentChange();
  };

  const updateCursorPosition = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const pos = textarea.selectionStart;
    const text = textarea.value.slice(0, pos);
    const lines = text.split("\n");
    setCursorLine(lines.length);
    setCursorCol(lines[lines.length - 1].length + 1);
  };

  const handleCursorMove = () => {
    updateCursorPosition();
  };

  const toggleFocus = (id: number) => {
    setFocused((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <div className="editor-container w-full h-full relative" style={{ fontSize }}>
      <div className="flex w-full h-full">
        <div
          ref={lineNumbersRef}
          className="bg-base-100 text-right overflow-y-hidden border-r border-base-content/0"
          style={{
            padding: "10px 5px 10px 5px",
            userSelect: "none",
            lineHeight: "21px",
            fontSize,
          }}
        >
          {lineNumbers.map((num, id) => {
            const isActive = id === cursorLine - 1;
            const isFocused = focused.includes(id);

            return (
              <div
                key={id}
                style={{ height: "21px" }}
                className={`flex gap-1 justify-between items-center ${
                  isActive ? "text-base-content" : "text-base-content/30"
                }`}
              >
                <div
                  className={`h-3 w-3 rounded-full cursor-pointer transition-colors duration-200 hover:bg-secondary/70 ${
                    isFocused ? "bg-secondary " : ""
                  }`}
                  onClick={() => toggleFocus(id)}
                />
                <div>{num}</div>
              </div>
            );
          })}
        </div>

        <div style={{ position: "relative", flexGrow: 1, height: "100%" }}>
          {/* Zone code highlight en fond */}
          <pre
            ref={codeHighlightRef}
            aria-hidden="true"
            className={`language-${Language}`}
            style={{
              margin: 0,
              padding: 10,
              fontFamily: "inter",
              fontSize,
              lineHeight: "21px",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflow: "hidden",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              color: "inherit",
              backgroundColor: "transparent",
            }}
          ></pre>

          {/* Textarea au-dessus */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onScroll={handleScroll}
            onClick={handleCursorMove}
            onKeyUp={handleCursorMove}
            spellCheck={false}
            style={{
              position: "relative",
              backgroundColor: "transparent",
              caretColor: "white",
              border: "none",
              outline: "none",
              resize: "none",
              width: "100%",
              height: "100%",
              opacity: 0,
              padding: 10,
              fontSize,
              fontFamily: "inter",
              lineHeight: "21px",
              whiteSpace: "pre-wrap",
              overflow: "auto",
              tabSize: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HtmlEditor;
