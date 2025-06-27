import React, { useEffect, useState } from "react";
import {
  FilePlus,
  Search,
  GitBranch,
  Settings,
  Download,
  Upload,
} from "lucide-react";
import LayerPanel from "../pages/DesignEditor/LayerPanel";
import ClassManager from "../pages/DesignEditor/ClassManager";
import StyleManager from "../pages/DesignEditor/StyleManager";

type SidebarItem = {
  label: string;
};

const Element: SidebarItem[] = [
  { label: "Home" },
  { label: "Dashboard" },
  { label: "Projects" },
  { label: "Messages" },
  { label: "Settings" },
];

const Sidebar = ({ editor, handleExport, handleImport }) => {
  const [activeSection, setActiveSection] = useState("explorer");
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // const pages = editor?.Pages.getAll() || [];
  useEffect(() => {
    if (editor) {
      const updateSelected = () =>
        setSelectedPageId(editor.Pages.getSelected()?.id || null);
      editor.on("page", updateSelected);
      updateSelected();
      return () => editor.off("page", updateSelected);
    }
  }, [editor]);

  const items = [
    {
      id: "explorer",
      icon: <FilePlus size={20} />,
      label: "Explorer",
      // content: <div>Explorer</div>,
    },
    {
      id: "search",
      icon: <Search size={20} />,
      label: "Rechercher",
      // content: <div>Rechercher</div>,
    },
    {
      id: "git",
      icon: <GitBranch size={20} />,
      label: "Git",
      // content: <div>Git</div>,
    },
  ];

  const handleSectionClick = (id: string) => {
    if (activeSection === id) {
      // Toggle sidebar visibility if clicking the same section
      setActiveSidebar(!activeSidebar);
    } else {
      // Switch to new section and ensure sidebar is visible
      setActiveSection(id);
      setActiveSidebar(true);
    }
  };

  return (
    <div
      className={`flex bg-base-200 ${
        activeSidebar ? "w-60" : "w-11"
      } text-base-content border-base-100/70 overflow-hidden border-r transition-all duration-300 h-screen`}
    >
      {/* Sidebar navigation */}
      <nav className="flex flex-col border-r justify-between border-base-100/70">
        <div className="flex flex-col border-base-100/50">
          {items.map(({id, icon, label }) => (
            <div key={id} className="tooltip  tooltip-right" data-tip={label}>
              <button
                key={id}
                onClick={() => handleSectionClick(id)}
                className={`border-l-3 border-0 btn btn-square btn-ghost rounded-none h-11 w-11 transition-colors duration-150 ${
                  activeSection === id ? "border-primary" : "border-transparent"
                }`}
                // title={label}
              >
                {icon}
              </button>
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={() => setActiveSidebar(false)}
            className={`border-l-3 border-0 btn btn-square btn-ghost rounded-none h-11 w-11 transition-colors duration-150 ${
              activeSection === "settings"
                ? "border-primary"
                : "border-transparent"
            }`}
            title="Paramètres"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

        <div id="blockManager" className="min-w-48 bg-base-100/50">
          {(() => {
            const item = items.find((item) => item.id === activeSection);
            return item ? (
              <React.Fragment key={item.id}>
                <div className="border-b border-base-100/50 font-semibold px-2 py-1 ">
                  {item.label}
                </div>
                <div className="px-2 py-1 h-full overflow-y-scroll">
                  {item.content ? (
                    <div className="h-full">{item.content}</div>
                  ) : (
                    <div className="text-sm text-base-content/50">
                      Aucun contenu n'a été trouvé
                    </div>
                  )}
                </div>
              </React.Fragment>
            ) : null;
          })()}
        </div>
    </div>
  );
};

export default Sidebar;
