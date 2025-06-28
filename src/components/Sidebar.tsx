import React, { useEffect, useState } from "react";
import {
  FilePlus,
  Search,
  GitBranch,
  Settings,
  Component as ComponentIcon,
} from "lucide-react";

import BlockList from "./Designer/BlockList";
import SearchReplace from "./SearchReplace";
import FileTree from "./fileTree";

type SidebarProps = {
  editor: any;
  handleExport?: () => void;
  handleImport?: () => void;
};

import initialData from "../Data/initialData";
const items: SidebarItem[] = [
  {
    id: "explorer",
    icon: <FilePlus size={20} />,
    label: "Explorer",
    content: <FileTree initialData={initialData} />,
  },
  {
    id: "component",
    icon: <ComponentIcon size={20} />,
    label: "Component",
    content: <BlockList editor={null} />, // updated dynamically later
  },
  {
    id: "search",
    icon: <Search size={20} />,
    label: "Rechercher",
    content: <SearchReplace />,
  },
  {
    id: "git",
    icon: <GitBranch size={20} />,
    label: "Git",
    content: undefined,
  },
]

type SidebarItem = {
  id: string;
  icon: JSX.Element;
  label: string;
  content?: JSX.Element;
};


const Sidebar: React.FC<SidebarProps> = ({ editor, handleExport, handleImport, activeSection, setActiveSection }) => {
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  useEffect(() => {
    if (editor) {
      const updateSelected = () =>
        setSelectedPageId(editor.Pages.getSelected()?.id || null);
      editor.on("page", updateSelected);
      updateSelected();
      return () => editor.off("page", updateSelected);
    }
  }, [editor]);

  const handleSectionClick = (id: string) => {
    if (activeSection === id) {
      setActiveSidebar(!activeSidebar);
    } else {
      setActiveSection(id);
      setActiveSidebar(true);
    }
  };

  return (
    <div
      className={`flex bg-base-200 min-w-11 text-base-content border-base-100/70 overflow-hidden border-r transition-all duration-300 h-full`}
    >
      <nav className="flex flex-col border-r justify-between border-base-100/70">
        <div className="flex flex-col border-base-100/50">
          {items.map(({ id, icon, label }) => (
            <div key={id} className="tooltip tooltip-right" data-tip={label}>
              <button
                onClick={() => handleSectionClick(id)}
                className={`border-l-3 border-0 btn btn-square btn-ghost rounded-none h-11 w-11 transition-colors duration-150 ${
                  activeSection === id ? "border-primary" : "border-transparent"
                }`}
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
              activeSection === "settings" ? "border-primary" : "border-transparent"
            }`}
            title="Paramètres"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

type SidePanelProps = {
  activeSection: string;
  editor: any;
};

export const SidePanel: React.FC<SidePanelProps> = ({ activeSection, editor }) => {
  const contentItem = items.find((item) => item.id === activeSection);

  if (contentItem?.id === "component") {
    contentItem.content = <BlockList editor={editor} />;
  }

  return (
    <div id="blockManager" className="bg-base-100/50 w-full h-full min-w-50">
      {contentItem ? (
        <>
          <div className="border-b border-base-100/50 font-semibold px-2 py-1">
            {contentItem.label}
          </div>
          <div className="h-full overflow-y-scroll">
            {contentItem.content ? (
              <div className="h-full">{contentItem.content}</div>
            ) : (
              <div className="text-sm text-base-content/50 px-2">
                Aucun contenu n'a été trouvé
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
