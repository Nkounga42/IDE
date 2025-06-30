import { SquareSplitHorizontal, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import CodeEditor from "./Editor/CodeEditor";
import Split from "split.js";
import getFileExtension from "../Services/getFileExtension";
import getFileFormat from "../Services/getFileFormat";

const OgletManager = ({
  mode,
  key,
  setCharCount,
  SetLanguage,
  language,
  theme,
  onglets,
  setOnglets,
  activeTab,
  setActiveTab,
}) => {
  const splitRef = useRef(null);

  // Réfs des deux panneaux à splitter
  const leftPaneRef = useRef(null);
  const rightPaneRef = useRef(null);

  useEffect(() => {
    if (leftPaneRef.current && rightPaneRef.current && !splitRef.current) {
      splitRef.current = Split([leftPaneRef.current, rightPaneRef.current], {
        sizes: [30, 70],
        minSize: [100, 200],
        gutterSize: 8,
        cursor: "col-resize",
        direction: "horizontal",
        snapOffset: 5,
      });
    }
    return () => {
      if (splitRef.current) {
        splitRef.current.destroy();
        splitRef.current = null;
      }
    };
  }, []);

  const handleDelete = (id: string) => {
    setOnglets((prev) => {
      const newOnglets = prev.filter((o) => o.id !== id);
      if (id === activeTab) {
        setActiveTab(newOnglets[0]?.id || "");
      }
      return newOnglets;
    });
  };

  const value =
    onglets.find((onglet) => onglet.id === activeTab)?.content || "";
 
  useEffect(() => {
  const currentOnglet = onglets.find((onglet) => onglet.id === activeTab);
  if (currentOnglet) {
    const extension = getFileExtension(currentOnglet.label);
    const format = getFileFormat(extension);
    SetLanguage(format);
  }
}, [activeTab, onglets]); // Ajoute l'effet ici
 
  
 
  return (
    // <div  className="flex flex-col h-full w-full border-l border-base-300">

    <div
      key={key}
      className="flex flex-1 h-full w-f overflow-hidden"
      style={{ minHeight: 50 }}
    >
      {/* Panel gauche - par exemple une liste */}
      {/* <div
          ref={leftPaneRef}
          className="overflow-auto border-r border-base-300"
          style={{ minWidth: 0 }}
        >
          Tu peux mettre ici autre chose,
        </div> */}

      <div
        ref={rightPaneRef}
        className="flex-1 flex-col h-full overflow-hidden"
        style={{ minWidth: 0 }}
      >
        <div className="tabs tabs-border flex w-full justify-between overflow-x-auto flex-shrink-0">
          <div className="flex-1 flex overflow-x-auto min-w-[70%]">
            {onglets.map((onglet) => (
              <ViewTab
                key={onglet.id}
                ViewTab={onglet}
                handleDelete={handleDelete}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onglet={onglet}
              />
            ))}
          </div>

          <div
            className="btn btn-ghost btn-square btn-sm ml-2"
            onClick={() => {
              const newId = `onglet-${onglets.length + 1}`;
              setOnglets((prev) => [
                ...prev,
                {
                  id: newId,
                  label: `Onglet ${onglets.length + 1}`,
                  content: `Onglet ${
                    onglets.length + 1
                  } tentative de creation de text`,
                },
              ]);
              setActiveTab(newId);
            }}
          >
            <SquareSplitHorizontal size={16} />
          </div>
        </div>
        {mode === "edition" ? (
          onglets.length > 0 ? (
            <CodeEditor
              language={language}
              theme={theme}
              code={value  }
              setCharCount={setCharCount}
            />
          ) : (
            <div className="flex justify-center h-full items-center text-base-content/30">
              Veillez selectionner un fichier
            </div>
          )
        ) : (
          <div className="flex justify-center h-full items-center text-base-content/30">
              Veillez selectionner un Mode
          </div>
        )}
      </div>
    </div>

    // </div>
  );
};

export default OgletManager;

const ViewTab = ({
  ViewTab,
  handleDelete,
  activeTab,
  onglet,
  setActiveTab,
}) => {
  const isActiveFile = activeTab === onglet.id;

  return (
    <div
      key={onglet.id}
      className={`group flex items-center justify-between pl-3 p-1  cursor-pointer
        ${
          isActiveFile
            ? "border-b border-primary bg-primary/10 text-primary-content"
            : "hover:text-base-content"
        }`}
      onClick={() => setActiveTab(onglet.id)}
    >
      <div>{onglet.label}</div>
      <button
        className={`
          btn btn-xs btn-circle btn-ghost ml-2
          ${isActiveFile ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          transition-opacity duration-150
        `}
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(onglet.id);
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
};
