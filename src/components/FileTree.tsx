import React, { useState, useEffect, useRef } from "react";
import Sortable from "sortablejs";
import {
  Folder,
  FolderOpen,
  File,
  Edit2,
  Trash2,
  FilePlus,
  FolderPlus,
  Copy,
  Scissors,
  ClipboardPaste,
  Code,
  PlayCircle,
  Brush,
} from "lucide-react";

type TreeNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
  parent?: TreeNode | null;
  content?: string;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const addParents = (
  nodes: TreeNode[],
  parent: TreeNode | null = null
): TreeNode[] => {
  return nodes.map((node) => {
    const newNode = { ...node, parent };
    if (newNode.children) {
      newNode.children = addParents(newNode.children, newNode);
    }
    return newNode;
  });
};

const FileTree: React.FC<{
  initialData: TreeNode[];
  openFile: (node: TreeNode) => void;
}> = ({ initialData, openFile }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>(addParents(initialData));
  const [contextNode, setContextNode] = useState<TreeNode | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [clipboard, setClipboard] = useState<TreeNode | null>(null);
  const [cutMode, setCutMode] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  const closeContextMenu = () => {
    setContextMenu(null);
    setContextNode(null);
  };

  const handleContextMenu = (e: React.MouseEvent, node: TreeNode) => {
    e.preventDefault();
    setContextNode(node);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };
    if (contextMenu) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  const updateTree = (
    updater: (node: TreeNode) => TreeNode | null,
    nodes: TreeNode[] = treeData
  ): TreeNode[] =>
    nodes
      .map((node) => {
        if (node.id === contextNode?.id) {
          return updater(node);
        } else if (node.children) {
          const updatedChildren = updateTree(updater, node.children);
          return { ...node, children: updatedChildren };
        }
        return node;
      })
      .filter(Boolean) as TreeNode[];

  const cleanNodeForClipboard = (node: TreeNode): TreeNode => {
    const { parent, ...rest } = node;
    if (rest.children) {
      rest.children = rest.children.map(cleanNodeForClipboard);
    }
    return rest;
  };

  const handleRename = () => {
    const newName = prompt("Nouveau nom :", contextNode?.name);
    if (!newName) return;
    const updated = updateTree((node) => ({ ...node, name: newName }));
    setTreeData(addParents(updated));
    closeContextMenu();
  };

  const handleDelete = () => {
    if (!contextNode) return;
    const removeNodeById = (
      nodes: TreeNode[],
      idToRemove: string
    ): TreeNode[] =>
      nodes
        .map((node) => {
          if (node.id === idToRemove) return null;
          if (node.children) {
            return {
              ...node,
              children: removeNodeById(node.children, idToRemove),
            };
          }
          return node;
        })
        .filter(Boolean) as TreeNode[];

    const updated = removeNodeById(treeData, contextNode.id);
    setTreeData(addParents(updated));
    closeContextMenu();
  };

  const handleCreate = (type: "file" | "folder") => {
    if (!contextNode || contextNode.type !== "folder") {
      alert("Vous devez sélectionner un dossier pour ajouter un élément.");
      return;
    }
    const name = prompt(
      `Nom du nouveau ${type === "file" ? "fichier" : "dossier"} :`
    );
    if (!name) return;
    const newNode: TreeNode = {
      id: generateId(),
      name,
      type,
      children: type === "folder" ? [] : undefined,
      parent: contextNode,
    };
    const updated = updateTree((node) =>
      node.id === contextNode.id
        ? { ...node, children: [...(node.children || []), newNode] }
        : node
    );
    setTreeData(addParents(updated));
    closeContextMenu();
  };

  const handleCopy = () => {
    if (contextNode) {
      const copy = cleanNodeForClipboard(contextNode);
      setClipboard(copy);
      setCutMode(false);
    }
    closeContextMenu();
  };

  const handleCut = () => {
    if (contextNode) {
      const copy = cleanNodeForClipboard(contextNode);
      setClipboard(copy);
      setCutMode(true);
    }
    closeContextMenu();
  };

  const handlePaste = () => {
    if (!clipboard || !contextNode || contextNode.type !== "folder") return;

    const cloneWithNewIds = (node: TreeNode): TreeNode => {
      const newNode = { ...node, id: generateId() };
      if (newNode.children) {
        newNode.children = newNode.children.map(cloneWithNewIds);
      }
      return newNode;
    };

    const pasted = cloneWithNewIds(clipboard);

    const updated = updateTree((node) =>
      node.id === contextNode.id
        ? { ...node, children: [...(node.children || []), pasted] }
        : node
    );

    let finalUpdated = updated;

    if (cutMode && clipboard) {
      const removeNodeById = (
        nodes: TreeNode[],
        idToRemove: string
      ): TreeNode[] =>
        nodes
          .map((node) => {
            if (node.id === idToRemove) return null;
            if (node.children) {
              return {
                ...node,
                children: removeNodeById(node.children, idToRemove),
              };
            }
            return node;
          })
          .filter(Boolean) as TreeNode[];

      finalUpdated = removeNodeById(updated, clipboard.id);
      setCutMode(false);
      setClipboard(null);
    }

    setTreeData(addParents(finalUpdated));
    closeContextMenu();
  };

  // --- GESTION DU DRAG & DROP ---

  // Déplacer un noeud dans l'arbre
  const moveNode = (
    draggedId: string,
    oldParentId: string | null,
    newParentId: string | null,
    oldIndex: number,
    newIndex: number
  ) => {
    let draggedNode: TreeNode | null = null;

    // Supprimer le noeud du parent source
    const removeNode = (nodes: TreeNode[], id: string): TreeNode[] => {
      return nodes.filter((node) => {
        if (node.id === id) {
          draggedNode = node;
          return false;
        }
        if (node.children) {
          node.children = removeNode(node.children, id);
        }
        return true;
      });
    };

    // Insérer le noeud dans le parent cible
    const insertNode = (
      nodes: TreeNode[],
      parentId: string | null,
      nodeToInsert: TreeNode,
      index: number
    ): TreeNode[] => {
      if (parentId === null) {
        const newNodes = [...nodes];
        newNodes.splice(index, 0, nodeToInsert);
        return newNodes;
      }
      return nodes.map((node) => {
        if (node.id === parentId && node.type === "folder") {
          const children = node.children ? [...node.children] : [];
          children.splice(index, 0, nodeToInsert);
          return { ...node, children };
        } else if (node.children) {
          return {
            ...node,
            children: insertNode(node.children, parentId, nodeToInsert, index),
          };
        }
        return node;
      });
    };

    let newTree = removeNode(treeData, draggedId);
    if (!draggedNode) return;

    newTree = insertNode(newTree, newParentId, draggedNode, newIndex);
    setTreeData(addParents(newTree));
  };

  // --- COMPOSANT RECURSIF ---

  type FolderNodeProps = {
    node: TreeNode;
    parentId: string | null;
  };

  const FolderNode: React.FC<FolderNodeProps> = ({ node, parentId }) => {
    const [isOpen, setIsOpen] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!listRef.current || !node.children) return;

      const sortable = Sortable.create(listRef.current, {
        group: "nested",
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
        onEnd: (evt) => {
          if (!evt.item || evt.oldIndex == null || evt.newIndex == null) return;
          const draggedId = evt.item.getAttribute("data-id");
          if (!draggedId) return;

          moveNode(draggedId, parentId, node.id, evt.oldIndex, evt.newIndex);
        },
      });

      return () => sortable.destroy();
    }, [node.children, parentId]);


    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    return (
      <div className="ml-2 items-start border-base-content/10 h-full w-full">
        <div
          onClick={() => {
            if (node.type === "folder") {
              setIsOpen(!isOpen);
            } else {
              setActiveNodeId(node.id);
              openFile(node);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, node)}
          className={`cursor-pointer select-none hover:bg-primary/10 px-1 py-1 flex items-center gap-1 ${
            node.id === activeNodeId ? "bg-primary/50" : ""
          }`}
          data-id={node.id}
        >
          {node.type === "folder" ? (
            isOpen ? (
              <FolderOpen size={16} className="text-orange-300" />
            ) : (
              <Folder size={16} className="text-orange-300" />
            )
          ) : (
            <File size={16} className="text-content-base" />
          )}
          <span>{node.name}</span>
        </div>

        {isOpen && node.children && (
          <div ref={listRef}>
            {node.children.map((child) => (
              <FolderNode key={child.id} node={child} parentId={node.id} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative font-mono text-sm flex h-full w-full">
      {treeData.map((node) => (
        <FolderNode key={node.id} node={node} parentId={null} />
      ))}

      {contextMenu && (
        <ul
          ref={menuRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-base-100 border border-base-200 p-1 rounded-lg shadow w-48 z-50 text-sm"
        >
          {[
            {
              icon: <Code size={16} />,
              label: "Ouvrir avec l'éditeur",
              onClick: () => {
                if (contextNode?.type === "file") {
                  openFile(contextNode);
                }
                closeContextMenu();
              },
            },
            {
              icon: <Brush size={16} />,
              label: "Ouvrir avec le Designer",
              onClick: () => console.log("Designer"),
            },
            {
              icon: <PlayCircle size={16} />,
              label: "Voir l'aperçu",
              onClick: () => console.log("aperçu"),
            },
            {
              icon: <Edit2 size={16} />,
              label: "Renommer",
              onClick: handleRename,
            },
            {
              icon: <Trash2 size={16} />,
              label: "Supprimer",
              onClick: handleDelete,
            },
            {
              icon: <FilePlus size={16} />,
              label: "Nouveau fichier",
              onClick: () => handleCreate("file"),
            },
            {
              icon: <FolderPlus size={16} />,
              label: "Nouveau dossier",
              onClick: () => handleCreate("folder"),
            },
            {
              icon: <Copy size={16} />,
              label: "Copier",
              onClick: handleCopy,
            },
            {
              icon: <Scissors size={16} />,
              label: "Couper",
              onClick: handleCut,
            },
            {
              icon: <ClipboardPaste size={16} />,
              label: "Coller",
              onClick:
                clipboard && contextNode?.type === "folder"
                  ? handlePaste
                  : undefined,
              disabled: !clipboard || contextNode?.type !== "folder",
            },
            {
              icon: <FolderOpen size={16} />,
              label: "Copier chemin relatif",
              onClick: () => {
                if (!contextNode) return;
                const getPath = (node: TreeNode | null): string =>
                  node
                    ? node.parent
                      ? getPath(node.parent) + "/" + node.name
                      : node.name
                    : "";
                navigator.clipboard.writeText(getPath(contextNode));
                closeContextMenu();
              },
            },
            {
              icon: <Folder size={16} />,
              label: "Copier chemin absolu",
              onClick: () => {
                if (!contextNode) return;
                const getAbsolutePath = (node: TreeNode | null): string =>
                  node
                    ? node.parent
                      ? getAbsolutePath(node.parent) + "/" + node.name
                      : "/root/" + node.name
                    : "";
                navigator.clipboard.writeText(getAbsolutePath(contextNode));
                closeContextMenu();
              },
            },
          ].map(({ label, icon, onClick, disabled }, i) => (
            <li
              key={i}
              className={`px-3 py-1 flex items-center hover:bg-base-300 rounded-lg ${
                disabled
                  ? "text-base-content/50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={disabled ? undefined : onClick}
            >
              {icon}
              <span className="ml-2">{label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileTree;
