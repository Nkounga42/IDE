// FILEPATH: d:/web master/SAAS/IDE/src/pages/EditionArea.tsx

import React, { useState, useEffect } from "react";
import CodeEditor from "./codeEditor/CodeEditor";
import { Play } from "lucide-react";
import DesignArea from "./DesignEditor/DesignArea";

type TabData = {
  id: string;
  label: string;
  language: string;
};

const tabsConfig: TabData[] = [
  { id: "css", label: "CSS", language: "css" },
  { id: "html", label: "HTML", language: "html" },
  { id: "js", label: "JavaScript", language: "javascript" },
  { id: "preview", label: "preview", language: "preview" },
];

const EditionArea = ({
  fontSize,
  handleCodeChange,
  setDragMode,
}: {
  fontSize: number;
  handleCodeChange: (code: string) => void;
  setDragMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedTab, setSelectedTab] = useState("html");

  // State to store code for each tab
  const [codes, setCodes] = useState<{
    [key: string]: string;
  }>({
    css: `/* CSS initial */\nbody { margin: 0; }`,
    html: `<!-- HTML initial -->\n<div>Hello world</div>`,
    js: `// JS initial\nconsole.log("Hello");`,
  });

  const currentLanguage = tabsConfig.find((tab) => tab.id === selectedTab)?.language || "text";

  const handleCodeChangeLocal = (code: string) => {
    setCodes((prev) => ({
      ...prev,
      [selectedTab]: code,
    }));
    handleCodeChange(code); // Propagate change
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
  }, [codes.css, codes.html, codes.js]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Tabs */}
      <div role="tablist" className="flex align-center justify-between">
        <div role="tablist" className="tabs tabs-lift">
          {tabsConfig.map((tab) => (
            <a
              key={tab.id}
              role="tab"
              className={`tab ${selectedTab === tab.id ? "tab-active" : ""}`}
              onClick={() => setSelectedTab(tab.id)}
              tabIndex={0}
              aria-selected={selectedTab === tab.id}
            >
              {tab.label}
            </a>
          ))}
        </div>
        {/* <button className="btn btn-ghost" onClick={() => setDragMode(true)}>
          <Play size={14} fill="currentColor" />
        </button> */}
      </div>
      {selectedTab !== "preview" ? (
        <div className="flex-1 bg-base-100 border-base-300">
          <DesignArea/>
          {/* <CodeEditor
            code={codes[selectedTab]}
            language={currentLanguage}
            onChange={handleCodeChangeLocal}
            fontSize={fontSize}
          /> */}
        </div>
      ) : (
        <div className="flex-1 bg-base-100 border-base-300">
          <iframe
            srcDoc={srcDoc}
            title="preview"
            sandbox="allow-scripts"
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ backgroundColor: "white" }}
          />
        </div>
      )}
    </div>
  );
};

export default EditionArea;
