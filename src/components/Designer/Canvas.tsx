import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "./designerStyle.css";
import loadCustomBlocks from "./loadCustomBlocks";
// import loadCustomBlocks from "./customBlocks"; // décommenter si besoin

type CanvasProps = {
  setEditor: (editor: grapesjs.Editor) => void;
};

const DaisyUI = [
  "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.3/base.css",
  "https://cdn.jsdelivr.net/npm/daisyui@4.4.20/dist/full.css",
];

const Canvas = ({ setEditor }: CanvasProps) => {
  const blocksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!blocksRef.current) return;

    const editorGrapes = grapesjs.init({
      container: blocksRef.current,
      height: "100%",
      width: "100%",
      storageManager: false,
      fromElement: false,
      pluginsOpts: {
        "gjs-blocks-basic": {
          blocks: [],
        },
      },
      panels: {
        defaults: [],
      },
      canvas: {
        styles: DaisyUI,
      },
    });

    editorGrapes.BlockManager.add("daisy-hero", {
      label: "Hero",
      category: "DaisyUI",
      content: {
        type: "default",
        components: `
      <div class='hero min-h-screen bg-base-200'>
        <div class='hero-content text-center'>
          <div class='max-w-md'>
            <h1 class='text-5xl font-bold'>Bienvenue</h1>
            <p class='py-6'>DaisyUI intégré à GrapesJS !</p>
            <button class='btn btn-primary'>Commencer</button>
          </div>
        </div>
      </div>
    `,
      },
    });
    loadCustomBlocks(editorGrapes); // décommenter si tu as des blocs personnalisés
    setEditor(editorGrapes);

    return () => {
      editorGrapes.destroy();
    };
  }, [setEditor]);

  return (
    <div className="flex w-full h-full">
      <div id="gjs" ref={blocksRef} style={{ flexGrow: 1 }}></div>
    </div>
  );
};

export default Canvas;
