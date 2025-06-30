import React, { useEffect, useState } from "react";
import {
  FilePlus,
  Search,
  GitBranch,
  Settings,
  Component as ComponentIcon,
} from "lucide-react";
 
import SearchReplace from "./SearchReplace";
import FileTree from "./FileTree";

import initialData from "../Data/initialData";
import BlockList from "./BlockList";

type TreeNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
  parent?: TreeNode | null;
  content?: string;
};

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  content?: React.ReactNode;
}

interface SidebarProps {
  editor: grapesjs.Editor | null;
  activeSidePanel: string;
  setActiveSidePanel: React.Dispatch<React.SetStateAction<string>>;
  handleImport?: () => void;
  handleExport?: () => void;
  openFile: (node: TreeNode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  editor, 
  openFile, // on récupère openFile ici
  activeSidePanel,
  setActiveSidePanel,
}) => {
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
    if (activeSidePanel === id) {
      setActiveSidebar(!activeSidebar);
    } else {
      setActiveSidePanel(id);
      setActiveSidebar(true);
    }
  };

  const items: SidebarItem[] = [
    {
      id: "explorer",
      icon: <FilePlus size={20} />,
      label: "Explorer",
      content: <FileTree initialData={initialData}  openFile={openFile}  />,
    },
    {
      id: "component",
      icon: <ComponentIcon size={20} />,
      label: "Component",
      content: <BlockList editor={editor} />,
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
  ];

  const activeContentItem = items.find((item) => item.id === activeSidePanel);

  return (
    <div className="flex bg-base-200 min-w-11 text-base-content border-base-100/70 overflow-hidden border-r transition-all duration-300 h-full">
      <nav className="flex flex-col border-r justify-between border-base-100/70">
        <div className="flex flex-col border-base-100/50">
          {items.map(({ id, icon, label }) => (
            <div key={id} className="tooltip tooltip-right" data-tip={label}>
              <button
                onClick={() => handleSectionClick(id)}
                className={`border-l-3 border-0 btn btn-square btn-ghost rounded-none h-11 w-11 transition-colors duration-150 ${
                  activeSidePanel === id ? "border-primary bg-primary/10" : "border-transparent"
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
            className={`border-l-3 border-0 btn btn-square btn-ghost rounded-none h-11 w-11 transition-colors duration-150 tooltip tooltip-right ${
              activeSidePanel === "settings"
                ? "border-primary bg-primary/10"
                : "border-transparent"
            }`}
            data-tip="Paramètres"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>
      {/* activeSidePanel */}
      {activeSidebar && <SidePanel
        activeSidePanel={activeSidePanel}
        editor={editor}
        openFile={openFile}
        contentItem={activeContentItem}
      />}
    </div>
  );
};

type SidePanelProps = {
  activeSidePanel: string;
  editor: any;
  openFile: (node: TreeNode) => void;
  contentItem?: SidebarItem;
};

export const SidePanel: React.FC<SidePanelProps> = ({
  activeSidePanel,
  editor,
  openFile,
  contentItem,
}) => {
  // Met à jour content si component
  if (contentItem?.id === "component") {
    contentItem.content = <BlockList editor={editor} />;
  }

  return (
    <div id="blockManager" className="bg-base-100/50 w-full h-full flex flex-1 flex-col min-w-72">
      {contentItem ? (
        <>
          <div className="border-b border-base-100/50 font-semibold px-2 py-1">
            {contentItem.label}
          </div>
          <div className="h-full max-w-72 flex overflow-y-scroll">
            {contentItem.content ? (
              <div className="h-full w-full">{contentItem.content}  </div>
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

export default Sidebar;
