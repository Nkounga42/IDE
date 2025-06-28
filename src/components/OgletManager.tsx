import { X } from "lucide-react";
import React, { useState } from "react";
import CodeEditor from "./Editor/CodeEditor";



const OgletManager = ({ setCharCount, language, theme , initialOnglets }) => {
  const [onglets, setOnglets] = useState(initialOnglets);
  const [activeSection, setActiveSection] = useState("tab2");

  const handleDelete = (id: string) => {
    setOnglets((prev) => {
      const newOnglets = prev.filter((o) => o.id !== id);
      // Si on supprime l'onglet actif, on active le précédent ou le premier restant
      if (id === activeSection) {
        const nextActive = newOnglets[0]?.id || null;
        setActiveSection(nextActive);
      }
      return newOnglets;
    });
  };
  const value =
    onglets.find((onglet) => onglet.id === activeSection)?.content || "";
  return (
    <div className="flex flex-col h-full w-full border-l border-base-300">
      {/* Onglets */}
      <div className="tabs tabs-border bg-base-200overflow-x-auto">
        {onglets.map((onglet) => (
          <ViewTab
            key={onglet.id}
            ViewTab={onglet}
            handleDelete={handleDelete}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onglet={onglet}
          />
        ))}
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="flex-1 bg-base-100 overflow-auto">
        { value ? (
          <CodeEditor
            language={language}
            theme={theme}
            code={value}
            setCharCount={setCharCount}
            onContentChange={() => console.log("Content changed")}
          />
        ) : (
          <span className="text-sm text-base-content/50">Aucun contenu</span>
        )}
      </div>
    </div>
  );
};

export default OgletManager;

const ViewTab = ({
  ViewTab,
  handleDelete,
  activeSection,
  onglet,
  setActiveSection,
}) => {
  const isActive = activeSection === onglet.id;

  return (
    <div
      key={onglet.id}
      className={`group flex items-center justify-between pl-3 p-1 cursor-pointer
        ${
          isActive
            ? "border-b border-primary bg-primary/10 text-primary-content"
            : "hover:text-base-content"
        }`}
      onClick={() => setActiveSection(onglet.id)} // <- Tu dois activer l'onglet ici, et non le supprimer
    >
      <div>{onglet.label}</div>
      <button
        className={`
          btn btn-xs btn-circle btn-ghost ml-2
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          transition-opacity duration-150
        `}
        onClick={(e) => {
          e.stopPropagation(); // évite l'activation de l'onglet lors du clic sur X
          handleDelete(onglet.id);
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
};
