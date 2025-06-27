
import React, { useState, useEffect } from "react";
import CodeEditor from "./codeEditor/CodeEditor";
import DesignArea from "./DesignEditor/DesignArea";

const tabsConfig = [
  { id: "css", label: "CSS", language: "css" },
  { id: "html", label: "HTML", language: "html" },
  { id: "js", label: "JavaScript", language: "javascript" },
  { id: "design", label: "Design", language: "html" },
  { id: "preview", label: "Preview", language: "preview" },
];

const EditionArea = ({ inspector, setInspector, fontSize, handleCodeChange, setDragMode }) => {
  const [selectedTab, setSelectedTab] = useState("html");

  const [codes, setCodes] = useState({
    css: `/* CSS initial */\nbody { margin: 0; }`,
    html: `<!-- HTML initial -->\n<div>Hello world</div>`,
    js: `// JS initial\nconsole.log("Hello");`,
  });

  const currentLanguage = tabsConfig.find((tab) => tab.id === selectedTab)?.language || "text";

  const handleCodeChangeLocal = (code: string) => {
    setCodes((prev) => ({ ...prev, [selectedTab]: code }));
    handleCodeChange(code);
  };

  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <style>${codes.css}</style>
          </head>
          <body>
            ${codes.html}
            <script>
              ${codes.js}
            </script>
          </body>
        </html>
      `);
    }, 250);
    return () => clearTimeout(timeout);
  }, [codes]);

  return (
    <div className="h-full w-full flex flex-col">
      <div role="tablist" className="flex align-center justify-between">
        <div role="tablist" className="tabs tabs-lift">
          {tabsConfig.map((tab) => (
            <a
              key={tab.id}
              role="tab"
              className={`tab ${selectedTab === tab.id ? "tab-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedTab(tab.id);
              }}
              tabIndex={0}
              aria-selected={selectedTab === tab.id}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-base-100 border-base-300">
        {selectedTab === "preview" ? (
          <iframe
            srcDoc={srcDoc}
            title="preview"
            sandbox="allow-scripts"
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ backgroundColor: "white" }}
          />
        ) : selectedTab === "design" ? (
          <DesignArea setInspector={setInspector} />
        ) : (
          <CodeEditor
            code={codes[selectedTab]}
            language={currentLanguage}
            onChange={handleCodeChangeLocal}
            fontSize={fontSize}
          />
        )}
      </div>
    </div>
  );
};

export default EditionArea;