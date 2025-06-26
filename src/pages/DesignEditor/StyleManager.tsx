import React, { useEffect, useState } from "react";
import StyleSector from "./StyleSector.tsx";

type StyleManagerProps = {
  editor: grapesjs.Editor | null;
};

 
type Prop = {
  name: string;
  type: string;
  units?: string[];
  min?: number;
  max?: number;
  defaultUnit?: string;
  options?: string[];
};

type Sector = {
  name: string;
  open: boolean;
  properties: Prop[];
};

const styleSectors: Sector[] = [
  {
    name: "Dimension",
    open: true,
    properties: [
      { name: "width", type: "integer", units: ["px", "%", "em", "rem"], min: 0, defaultUnit: "px" },
      { name: "height", type: "integer", units: ["px", "%", "em", "rem"], min: 0, defaultUnit: "px" },
      { name: "min-width", type: "integer", units: ["px", "%", "em", "rem"], min: 0, defaultUnit: "px" },
      { name: "min-height", type: "integer", units: ["px", "%", "em", "rem"], min: 0, defaultUnit: "px" },
      { name: "max-width", type: "integer", units: ["px", "%", "em", "rem"], min: 0, defaultUnit: "px" },
      { name: "max-height", type: "integer", units: ["px", "%", "em", "rem"], min: 0, defaultUnit: "px" },
    ],
  },
  {
    name: "Typography",
    open: true,
    properties: [
      {
        name: "font-family",
        type: "select",
        options: [
          "Arial, Helvetica, sans-serif",
          "'Courier New', Courier, monospace",
          "'Times New Roman', Times, serif",
          "Georgia, serif",
          "Verdana, Geneva, Tahoma, sans-serif",
        ],
      },
      { name: "font-size", type: "integer", units: ["px", "em", "rem"], min: 1, max: 200, defaultUnit: "px" },
      { name: "font-weight", type: "select", options: ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
      { name: "letter-spacing", type: "integer", units: ["px", "em", "rem"], min: 0, defaultUnit: "px" },
      { name: "line-height", type: "integer", units: ["", "px", "em", "rem"], min: 0, defaultUnit: "" },
      { name: "color", type: "color" },
      { name: "text-align", type: "select", options: ["left", "center", "right", "justify"] },
    ],
  },
  {
    name: "Decoration",
    open: false,
    properties: [
      { name: "background-color", type: "color" },
      { name: "border-radius", type: "integer", units: ["px", "%"], min: 0, defaultUnit: "px" },
      { name: "border-width", type: "integer", units: ["px"], min: 0, defaultUnit: "px" },
      { name: "border-style", type: "select", options: ["none", "solid", "dashed", "dotted", "double", "groove"] },
      { name: "border-color", type: "color" },
      { name: "box-shadow", type: "text" },
      { name: "opacity", type: "integer", min: 0, max: 100, defaultUnit: "%" },
    ],
  },
  {
    name: "Extra",
    open: false,
    properties: [
      { name: "overflow", type: "select", options: ["visible", "hidden", "scroll", "auto"] },
      { name: "cursor", type: "select", options: ["auto", "default", "pointer", "text", "move", "wait", "help"] },
      { name: "visibility", type: "select", options: ["visible", "hidden", "collapse"] },
      { name: "z-index", type: "integer", min: 0, max: 9999 },
      { name: "box-sizing", type: "select", options: ["content-box", "border-box"] },
      { name: "transition", type: "text" },
    ],
  },
];


type StyleSector = {
  name: string;
  open: boolean;
  properties: StyleProperty[];
};

type StyleProperty = {
  name: string;
  type: string;
  units?: string[];
  min?: number;
  max?: number;
  defaultUnit?: string;
  options?: string[];
};

const StyleManager = ({ editor }: StyleManagerProps) => {
  const [selectedComp, setSelectedComp] = useState<grapesjs.Model | null>(null);
  const [styles, setStyles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const comp = editor.getSelected();
      setSelectedComp(comp);
      if (comp) setStyles(comp.getStyle() || {});
      else setStyles({});
    };

    editor.on("component:selected", updateSelection);
    editor.on("component:update", updateSelection);
    editor.on("component:styleUpdate", updateSelection);

    return () => {
      editor.off("component:selected", updateSelection);
      editor.off("component:update", updateSelection);
      editor.off("component:styleUpdate", updateSelection);
    };
  }, [editor]);

  const handleStyleChange = (prop: string, value: string) => {
    if (!selectedComp) return;
    const newStyles = { ...styles, [prop]: value };
    setStyles(newStyles);
    selectedComp.setStyle(newStyles);
  };

  if (!selectedComp) return <div>Sélectionnez un composant pour modifier ses styles</div>;

  return (
    <div className="p-4 max-h-full overflow-auto bg-base-100 border-l border-base-300">
      <h3 className="font-bold mb-4">Style Manager</h3>
      {styleSectors.map((sector) => (
        <StyleSector key={sector.name} sector={sector} styles={styles} onChange={handleStyleChange} />
      ))}
    </div>
  );
};

export default StyleManager;
