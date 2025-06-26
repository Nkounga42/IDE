import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import clsx from "clsx";

type DropPosition = "above" | "inside" | "below" | null;

const LayerNode = ({
  component,
  selectedId,
  onSelect,
  onDrop,
}: {
  component: grapesjs.Component;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDrop: (
    draggedId: string,
    targetId: string,
    position: DropPosition
  ) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const isSelected = component.getId() === selectedId;
  const children = component.components();
  const ref = useRef<HTMLDivElement>(null);
  const [dropPos, setDropPos] = useState<DropPosition>(null);

  // Cleanup dropPos on unmount or when drag leaves
  const clearDrop = () => setDropPos(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", component.getId());
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const height = rect.height;

    if (offsetY < height / 3) setDropPos("above");
    else if (offsetY > (2 * height) / 3) setDropPos("below");
    else setDropPos("inside");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    clearDrop();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (
      draggedId &&
      draggedId !== component.getId() &&
      dropPos !== null
    ) {
      onDrop(draggedId, component.getId(), dropPos);
    }
    clearDrop();
  };

  return (
    <div
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        "ml-2 rounded select-none",
        isSelected && "bg-primary text-primary-content",
        dropPos && "relative"
      )}
    >
      {/* Highlight top */}
      {dropPos === "above" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-t-md pointer-events-none" />
      )}

      <div
        className={clsx(
          "flex items-center px-2 py-1 cursor-pointer",
          dropPos === "inside" && "bg-blue-200"
        )}
        onClick={() => onSelect(component.getId())}
      >
        {children.length > 0 ? (
          <button
            className="mr-1"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            type="button"
            aria-label={expanded ? "Réduire" : "Développer"}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
        <LayoutGrid className="w-4 h-4 mr-2 opacity-50" />
        <span className="text-sm truncate">
          {component.getName() || component.getTagName()}
        </span>
        {component.getId() && (
          <span className="badge badge-xs badge-outline ml-2">
            #{component.getId()}
          </span>
        )}
      </div>

      {/* Highlight bottom */}
      {dropPos === "below" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b-md pointer-events-none" />
      )}

      {expanded && children.length > 0 && (
        <div className="ml-4 border-l border-base-300 pl-2">
          {children.map((child) => (
            <LayerNode
              key={child.getId()}
              component={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LayerPanel = ({ editor }: { editor: grapesjs.Editor | null }) => {
  const [rootComponents, setRootComponents] = useState<grapesjs.Component[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    const wrapper = editor.getWrapper();

    const updateComponents = () => {
      setRootComponents([...wrapper.components().models]);
    };

    const updateSelection = () => {
      const selected = editor.getSelected();
      setSelectedId(selected?.getId() || null);
    };

    updateComponents();
    updateSelection();

    editor.on("component:add", updateComponents);
    editor.on("component:remove", updateComponents);
    editor.on("component:selected", updateSelection);
    editor.on("component:update", updateComponents);

    return () => {
      editor.off("component:add", updateComponents);
      editor.off("component:remove", updateComponents);
      editor.off("component:selected", updateSelection);
      editor.off("component:update", updateComponents);
    };
  }, [editor]);

  const handleSelect = (id: string) => {
    const model = editor?.DomComponents.getWrapper().find(`#${id}`)[0];
    if (model) editor.select(model);
  };

  const handleDrop = (
    draggedId: string,
    targetId: string,
    position: DropPosition
  ) => {
    if (!editor) return;

    const wrapper = editor.DomComponents.getWrapper();
    const dragged = wrapper.find(`#${draggedId}`)[0];
    const target = wrapper.find(`#${targetId}`)[0];

    if (!dragged || !target) return;

    // Empêche le drop sur soi-même ou sur un descendant
    if (dragged === target || dragged.isAncestor(target)) return;

    dragged.remove();

    if (position === "inside") {
      target.append(dragged);
    } else {
      const parent = target.parent();
      if (!parent) return;

      const siblings = parent.components();
      const targetIndex = siblings.indexOf(target);

      if (position === "above") {
        parent.insert(dragged, { at: targetIndex });
      } else if (position === "below") {
        parent.insert(dragged, { at: targetIndex + 1 });
      }
    }

    editor.select(dragged);
  };

  return (
    <div className="p-2 bg-base-100 h-full overflow-auto select-none">
      <h2 className="text-lg font-semibold mb-3">Calques</h2>
      {rootComponents.length === 0 ? (
        <div className="text-sm text-gray-500">Aucun composant</div>
      ) : (
        <div className="space-y-1">
          {rootComponents.map((comp) => (
            <LayerNode
              key={comp.getId()}
              component={comp}
              selectedId={selectedId}
              onSelect={handleSelect}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerPanel;
