import React, { useState } from 'react';

type TreeNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
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

const FileTree: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);
  const [contextNode, setContextNode] = useState<TreeNode | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [clipboard, setClipboard] = useState<TreeNode | null>(null);

  const closeContextMenu = () => {
    setContextMenu(null);
    setContextNode(null);
  };

  const handleContextMenu = (e: React.MouseEvent, node: TreeNode) => {
    e.preventDefault();
    setContextNode(node);
    setContextMenu({ x: e.clientX, y: e.clientY });
    console.log({ x: e.clientX, y: e.clientY });
  };

  const updateTree = (updater: (node: TreeNode) => TreeNode | null, nodes: TreeNode[] = treeData): TreeNode[] => {
    return nodes
      .map((node) => {
        if (node.id === contextNode?.id) {
          return updater(node);
        } else if (node.children) {
          return { ...node, children: updateTree(updater, node.children) };
        }
        return node;
      })
      .filter(Boolean) as TreeNode[];
  };

  const handleRename = () => {
    const newName = prompt('Nouveau nom :', contextNode?.name);
    if (!newName) return;
    const updated = updateTree((node) => ({ ...node, name: newName }));
    setTreeData(updated);
    closeContextMenu();
  };

  const handleDelete = () => {
    const updated = updateTree(() => null);
    setTreeData(updated);
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
    setTreeData(updated);
    closeContextMenu();
  };

  const handleCopy = () => {
    if (contextNode) {
      const copy = JSON.parse(JSON.stringify(contextNode));
      setClipboard(copy);
    }
    closeContextMenu();
  };

  const handlePaste = () => {
    if (!clipboard || contextNode?.type !== 'folder') return;
    const pasted = { ...clipboard, id: generateId() };
    const updated = updateTree((node) =>
      node.id === contextNode.id
        ? { ...node, children: [...(node.children || []), pasted] }
        : node
    );
    setTreeData(updated);
    closeContextMenu();
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
          <li className={`px-3 py-1 hover:bg-base-300 cursor-pointer ${!clipboard ?  'rounded-lg text-base-content/50 cursor-not-allowed' : ''}`} onClick={clipboard ? handlePaste : undefined}>
            📥 Coller
          </li>
        </ul>
      )}
    </div>
  );
};

export default FileTree;
