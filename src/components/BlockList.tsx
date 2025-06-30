import React, { useEffect, useState } from "react";
import type grapesjs from "grapesjs";

 
 
type BlockListProps = {
  editor: grapesjs.Editor | null;
};

const BlockList = ({ editor }: BlockListProps) => {
  const [blocks, setBlocks] = useState<grapesjs.BlockManager.Block[]>([]);

  useEffect(() => {
    if (!editor || !editor.BlockManager) return;

    const bm = editor.BlockManager;

    const updateBlocks = () => {
      const all = bm.getAll().models;
      setBlocks([...all]);
    };

    updateBlocks();

    // ✅ Écoute via l’éditeur, pas BlockManager directement
    editor.on("block:add", updateBlocks);

    return () => {
      editor.off("block:add", updateBlocks);
    };
  }, [editor]);

 const handleAddBlock = (id: string) => {
  if (!editor) return;
  const block = editor.BlockManager.get(id);
  if (block) {
    const content = block.get("content");
alert('d')
    const root = editor.getComponents();

    const added = root.append(content);

    // selected le dernier élément ajouté
    if (Array.isArray(added)) {
      editor.select(added[added.length - 1]);
    } else {
      editor.select(added);
    }
  }
};


  if (!editor)
    return (
      <div className="text-sm text-base-content/50">
        Aucun block n'a été trouvé
      </div>
    );

  return (
    <div className="flex flex-col gap-1 ">
      {blocks.length === 0 && (
        <div className="text-sm text-base-content/50">
          Aucun block n'a été trouvé
        </div>
      )}

      {blocks.map((block) => (
        <div
          key={block.get("id")}
          onClick={() => handleAddBlock(block.get("id"))}
          className="hover:bg-primary py-1 px-2 text-base-content/70  hover:text-base-content btn-sm justify-start w-full"
        >
          {block.get("label")}
        </div>
      ))}
      
    </div>
  );
};

export default BlockList;
