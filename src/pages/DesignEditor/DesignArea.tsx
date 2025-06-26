import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-blocks-basic";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Eye,
  Maximize,
  Monitor,
  Undo2,
  Redo,
  Upload,
  Download,
  FilePlus,
  EyeOff,Code,
} from "lucide-react";
import StyleManager from "./StyleManager";
import ClassManager from "./ClassManager";
import LayerPanel from "./LayerPanel";

const DaisyUI = [
  "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.3/base.css",
  "https://cdn.jsdelivr.net/npm/daisyui@4.4.20/dist/full.css",
];
 
type GrapesToolbarProps = {
  editor: grapesjs.Editor | null;
  canvasReady: boolean;
};

const GrapesToolbar = ({ editor, canvasReady }: GrapesToolbarProps) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [device, setDevice] = useState<"Desktop" | "Tablet" | "Mobile" | "MobilePortrait">("Desktop");
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");

  if (!editor) return null;

  const togglePreview = () => {
    const isPreview = editor.Commands.isActive("preview");
    if (isPreview) {
      editor.Commands.stop("preview");
      setPreviewMode(false);
    } else {
      editor.Commands.run("preview");
      setPreviewMode(true);
    }
  };

  const toggleGrid = () => {
    try {
      const isActive = editor.Commands.isActive("sw-visibility");
      const iframe = editor.Canvas.getFrameEl();
      const body = iframe?.contentDocument?.body;
      if (body && body.querySelector && isActive) {
        editor.Commands.stop("sw-visibility");
        setGridVisible(false);
      } else {
        editor.Commands.run("sw-visibility");
        setGridVisible(true);
      }
    } catch (err) {
      alert("Erreur lors du changement de visibilité de la grille.");
      console.error(err);
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDevice = e.target.value as "Desktop" | "Tablet" | "Mobile";
    setDevice(selectedDevice);

    switch (selectedDevice) {
      case "Desktop":
        editor.setDevice("Desktop");
        break;
      case "Tablet":
        editor.setDevice("Tablet");
        break;
      case "Mobile":
        editor.setDevice("Mobile");
        break;
      case "MobilePortrait":
        editor.setDevice("MobilePortrait");
        break;
      default:
        editor.setDevice("Desktop");
    }
  };

  const openCodeModal = () => {
    setHtmlCode(editor.getHtml());
    setCssCode(editor.getCss());
    setCodeModalOpen(true);
  };

  const closeCodeModal = () => setCodeModalOpen(false);

  return (
    <>
      <div className="flex flex-wrap gap-2 p-2 bg-base-200 border-b border-base-300 items-center">
        <button onClick={togglePreview} className="btn btn-outline">
          {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} Preview
        </button>

        <button className="btn btn-sm" onClick={() => editor.runCommand("fullscreen")}>
          <Maximize className="w-4 h-4" /> Plein écran
        </button>

        <button
          className={`btn btn-sm ${gridVisible ? "btn-primary" : ""}`}
          onClick={toggleGrid}
          disabled={!canvasReady}
          title={!canvasReady ? "Canvas pas encore prêt" : ""}
        >
          <Monitor className="w-4 h-4" /> Grille
        </button>

        <button className="btn btn-sm" onClick={() => editor.runCommand("core:undo")}>
          <Undo2 className="w-4 h-4" /> Annuler
        </button>

        <button className="btn btn-sm" onClick={() => editor.runCommand("core:redo")}>
          <Redo className="w-4 h-4" /> Refaire
        </button>

        <select
          value={device}
          onChange={handleDeviceChange}
          className="select select-bordered select-sm max-w-xs"
        >
          <option value="Desktop">Desktop</option>
          <option value="Tablet">Tablet</option>
          <option value="Mobile">Mobile</option>
          <option value="MobilePortrait">Mobile Portrait</option>
        </select>

        <button className="btn btn-sm" onClick={openCodeModal}>
          <Code className="w-4 h-4" /> View Code
        </button>
      </div>

      {codeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-3xl max-h-[80vh] overflow-auto relative">
            <button
              onClick={closeCodeModal}
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
              aria-label="Close modal"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">HTML & CSS</h2>
            <h3 className="font-semibold">HTML</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mb-4 whitespace-pre-wrap">
              {htmlCode}
            </pre>
            <h3 className="font-semibold">CSS</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded whitespace-pre-wrap">
              {cssCode}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};
 


const DesignArea = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<grapesjs.Editor | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [html, setHtml] = useState<string>("");
  const [css, setCss] = useState<string>("");
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (editorRef.current && blocksRef.current && !editor) {
      const e = grapesjs.init({
        container: editorRef.current,
        height: "100vh",
        width: "100%",
        storageManager: false,
        fromElement: true,
        plugins: ["gjs-blocks-basic"],
        blockManager: {
          appendTo: blocksRef.current,
        },
        pageManager: {
          pages: [
            {
              id: "page-1",
              name: "Page 1",
              component: `<div class='p-10 text-lg text-red-600'>Bienvenue sur la page 1</div>`,
            },
            {
              id: "page-2",
              name: "Page 2",
              component: `<div class='p-10 text-lg text-green-600'>Bienvenue sur la page 2</div>`,
            },
          ],
        },
        canvas: {
          styles: DaisyUI,
        },
      });

      const bm = e.BlockManager;
      bm.add("daisy-hero", {
        label: "Hero",
        category: "DaisyUI",
        content: `<div class='hero min-h-screen bg-base-200'><div class='hero-content text-center'><div class='max-w-md'><h1 class='text-5xl font-bold'>Bienvenue</h1><p class='py-6'>DaisyUI intégré à GrapesJS !</p><button class='btn btn-primary'>Commencer</button></div></div></div>`,
      });

      bm.add("daisy-tabs", {
        label: "Tabs",
        category: "DaisyUI",
        content: `<div role='tablist' class='tabs tabs-boxed'><a role='tab' class='tab tab-active'>Tab 1</a><a role='tab' class='tab'>Tab 2</a><a role='tab' class='tab'>Tab 3</a></div>`,
      });

      setEditor(e);
      setPages(e.Pages.getAll());
      setSelectedPageId(e.Pages.getSelected()?.id || null);

      // Écouteur page changement
      e.on("page", () => {
        setPages(e.Pages.getAll());
        setSelectedPageId(e.Pages.getSelected()?.id || null);
      });

      // Écouteur canvas prêt
      e.on("canvas:load", () => {
        setCanvasReady(true);
        console.log("Canvas prêt !");
      });

      // Met à jour le html/css à chaque drop (tu peux étendre ça)
      e.on("canvas:drop", () => {
        setHtml(e.getHtml());
        setCss(e.getCss());
      });
    }
  }, [editor]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          editor.loadProjectData(json);
          alert("Projet JSON importé avec succès !");
        } catch {
          alert("Erreur JSON invalide");
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".zip")) {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const jsonFile = content.file("project.json");
      if (!jsonFile) return alert("Fichier project.json manquant");
      const json = JSON.parse(await jsonFile.async("string"));
      editor.loadProjectData(json);
      alert("Projet ZIP importé avec succès !");
    }
  };

  const handleExport = async () => {
    if (!editor) return;
    const zip = new JSZip();
    const html = editor.getHtml();
    const css = editor.getCss();
    const json = await editor.store();
    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("project.json", JSON.stringify(json, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "grapesjs_project.zip");
  };

  return (
    <div className="h-full flex flex-col">
    <div className="  flex flex-col">
      <GrapesToolbar editor={editor} canvasReady={canvasReady} />
       
      <div className="flex flex-1 overflow-hidden">
        <div
          ref={blocksRef}
          className="w-72 overflow-y-auto border-r border-base-300 p-2 bg-base-100"
        />
        <div hidden className="w-64 border-r border-base-300 p-2 bg-base-100 overflow-y-auto">
          <h3 className="text-lg font-semibold">Pages</h3>
          {pages.map((page) => (
            <div key={page.id} className="mb-2">
              <button
                className={`btn btn-sm w-full ${
                  selectedPageId === page.id ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => editor?.Pages.select(page.id)}
              >
                {page.get("name")}
              </button>
            </div>
          ))}

          <button
            className="btn btn-sm w-full btn-outline"
            onClick={() => {
              if (!editor) return;
              const newPage = editor.Pages.add({
                name: `Page ${pages.length + 1}`,
                component: `<div class='p-5'>Nouvelle page</div>`,
              });
              editor.Pages.select(newPage.id);
            }}
          >
            <FilePlus className="w-4 h-4" /> Ajouter page
          </button>

          <button className="btn btn-sm w-full mt-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Exporter
          </button>

          <label className="btn btn-sm w-full mt-2 cursor-pointer">
            <Upload className="w-4 h-4" /> Importer
            <input
              type="file"
              accept=".json,.zip"
              className="hidden"
              onChange={handleImport}
            />
          </label>

          <div className="mt-4 text-xs text-gray-400">
            <div>HTML: {html.length} chars</div>
            <div>CSS: {css.length} chars</div>
          </div>
        </div>

        <div ref={editorRef} className="flex-1 overflow-auto" />
      </div>
    </div>


     <LayerPanel editor={editor} />
        <ClassManager  editor={editor}/>
       <StyleManager editor={editor}/>
    </div>
  );
};

export default DesignArea;
