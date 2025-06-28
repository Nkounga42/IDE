import React, { useState, useEffect } from 'react';

type TreeNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  parent?: TreeNode | null;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialData: TreeNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      { id: '2', name: 'App.tsx', type: 'file' },
      { id: '3', name: 'index.tsx', type: 'file' },
      {
        id: '6',
        name: 'components',
        type: 'folder',
        children: [
          { id: '7', name: 'Button.tsx', type: 'file' },
          { id: '8', name: 'Modal.tsx', type: 'file' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'public',
    type: 'folder',
    children: [{ id: '5', name: 'index.html', type: 'file' }],
  },
];

// Ajoute les parents dans chaque noeud de l'arbre (utile pour éviter références circulaires lors des opérations)
const addParents = (nodes: TreeNode[], parent: TreeNode | null = null): TreeNode[] => {
  return nodes.map((node) => {
    const newNode = { ...node, parent };
    if (newNode.children) {
      newNode.children = addParents(newNode.children, newNode);
    }
    return newNode;
  });
};

const FileTree: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>(addParents(initialData));
  const [contextNode, setContextNode] = useState<TreeNode | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [clipboard, setClipboard] = useState<TreeNode | null>(null);
  const [cutMode, setCutMode] = useState(false); // Pour différencier copier / couper

  const closeContextMenu = () => {
    setContextMenu(null);
    setContextNode(null);
  };

  const handleContextMenu = (e: React.MouseEvent, node: TreeNode) => {
    e.preventDefault();
    setContextNode(node);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Met à jour l'arbre en appliquant updater sur le noeud sélectionné
  const updateTree = (updater: (node: TreeNode) => TreeNode | null, nodes: TreeNode[] = treeData): TreeNode[] => {
    return nodes
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
  };

  // Supprime les propriétés "parent" avant de copier dans le clipboard (évite les références circulaires)
  const cleanNodeForClipboard = (node: TreeNode): TreeNode => {
    const { parent, ...rest } = node;
    if (rest.children) {
      rest.children = rest.children.map(cleanNodeForClipboard);
    }
    return rest;
  };

  const handleRename = () => {
    const newName = prompt('Nouveau nom :', contextNode?.name);
    if (!newName) return;
    const updated = updateTree((node) => ({ ...node, name: newName }));
    setTreeData(addParents(updated));
    closeContextMenu();
  };

  const handleDelete = () => {
    const updated = updateTree(() => null);
    setTreeData(addParents(updated));
    closeContextMenu();
  };

  const handleCreate = (type: 'file' | 'folder') => {
    const name = prompt(`Nom du nouveau ${type === 'file' ? 'fichier' : 'dossier'} :`);
    if (!name) return;
    const newNode: TreeNode = {
      id: generateId(),
      name,
      type,
      children: type === 'folder' ? [] : undefined,
    };
    const updated = updateTree((node) =>
      node.type === 'folder'
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
    if (!clipboard || contextNode?.type !== 'folder') return;
    // Génère un nouvel id récursivement pour le noeud collé et ses enfants
    const cloneWithNewIds = (node: TreeNode): TreeNode => {
      const newNode = { ...node, id: generateId() };
      if (newNode.children) {
        newNode.children = newNode.children.map(cloneWithNewIds);
      }
      return newNode;
    };
    const pasted = cloneWithNewIds(clipboard);
    let updated = updateTree((node) =>
      node.id === contextNode.id
        ? { ...node, children: [...(node.children || []), pasted] }
        : node
    );

    // Si on était en mode couper, on supprime l'original
    if (cutMode) {
      updated = removeNodeById(updated, clipboard.id);
      setCutMode(false);
      setClipboard(null);
    }

    setTreeData(addParents(updated));
    closeContextMenu();
  };

  // Supprime un noeud de l'arbre par id (utile pour couper)
  const removeNodeById = (nodes: TreeNode[], idToRemove: string): TreeNode[] => {
    return nodes
      .map((node) => {
        if (node.id === idToRemove) return null;
        if (node.children) {
          return { ...node, children: removeNodeById(node.children, idToRemove) };
        }
        return node;
      })
      .filter(Boolean) as TreeNode[];
  };

  const FolderNode: React.FC<{ node: TreeNode }> = ({ node }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="ml-2">
        <div
          onClick={() => node.type === 'folder' && setIsOpen(!isOpen)}
          onContextMenu={(e) => handleContextMenu(e, node)}
          className="cursor-pointer select-none hover:bg-base-300 rounded px-1"
        >
          {node.type === 'folder' ? (isOpen ? '📂' : '📁') : '📄'} {node.name}
        </div>
        {isOpen &&
          node.children?.map((child) => <FolderNode key={child.id} node={child} />)}
      </div>
    );
  };

  return (
    <div onClick={closeContextMenu} className="relative font-mono text-sm p-2">
      {treeData.map((node) => (
        <FolderNode key={node.id} node={node} />
      ))}

      {contextMenu && (
        <ul
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-base-100 border border-base-200 p-1 rounded-lg shadow w-48 z-50 text-sm"
        >
          <li className="px-3 py-1 hover:bg-base-300 cursor-pointer rounded-lg" onClick={handleRename}>
            ✏️ Renommer
          </li>
          <li className="px-3 py-1 hover:bg-base-300 cursor-pointer rounded-lg" onClick={handleDelete}>
            🗑 Supprimer
          </li>
          <li className="px-3 py-1 hover:bg-base-300 cursor-pointer rounded-lg" onClick={() => handleCreate('file')}>
            📄 Nouveau fichier
          </li>
          <li className="px-3 py-1 hover:bg-base-300 cursor-pointer rounded-lg" onClick={() => handleCreate('folder')}>
            📁 Nouveau dossier
          </li>
          <li className="px-3 py-1 hover:bg-base-300 cursor-pointer rounded-lg" onClick={handleCopy}>
            📋 Copier
          </li>
          <li className="px-3 py-1 hover:bg-base-300 cursor-pointer rounded-lg" onClick={handleCut}>
            ✂️ Couper
          </li>
          <li
            className={`px-3 py-1 hover:bg-base-300 cursor-pointer ${
              !clipboard || contextNode?.type !== 'folder'
                ? 'rounded-lg text-base-content/50 cursor-not-allowed'
                : 'rounded-lg'
            }`}
            onClick={clipboard && contextNode?.type === 'folder' ? handlePaste : undefined}
          >
            📥 Coller
          </li>
          <li
            className="px-3 py-1 hover:bg-base-300 cursor-pointer rounded-lg"
            onClick={() => {
              if (!contextNode) return;
              // Copier le chemin relatif (depuis la racine)
              const getPath = (node: TreeNode | null): string => {
                if (!node) return '';
                return node.parent ? getPath(node.parent) + '/' + node.name : node.name;
              };
              navigator.clipboard.writeText(getPath(contextNode));
              closeContextMenu();
            }}
          >
            📂 Copier chemin relatif
          </li>
          <li
            className="px-3 py-1 hover:bg-base-300 cursor-pointer rounded-lg"
            onClick={() => {
              if (!contextNode) return;
              // Copier le chemin absolu (simulateur ici = chemin relatif avec /root)
              const getAbsolutePath = (node: TreeNode | null): string => {
                if (!node) return '';
                return node.parent ? getAbsolutePath(node.parent) + '/' + node.name : '/root/' + node.name;
              };
              navigator.clipboard.writeText(getAbsolutePath(contextNode));
              closeContextMenu();
            }}
          >
            📁 Copier chemin absolu
          </li>
        </ul>
      )}
    </div>
  );
};

export default FileTree;
