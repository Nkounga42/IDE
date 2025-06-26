import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "grapesjs-blocks-basic";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DaisyUI = [
  "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.3/base.css",
  "https://cdn.jsdelivr.net/npm/daisyui@4.4.20/dist/full.css",
];

const DesignArea = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  
  // Import des projets JSON ou ZIP
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    
    if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          try {
            const json = JSON.parse(text);
            editor.loadProjectData(json);
            const firstPage = editor.Pages.getAll()[0];
            if (firstPage) editor.Pages.select(firstPage.id);
            alert("Projet importé avec succès !");
          } catch {
            alert("Échec de l'importation : format JSON invalide");
          }
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".zip")) {
      const zip = new JSZip();
      try {
        const content = await zip.loadAsync(file);
        const jsonFile = content.file("project.json");
        if (!jsonFile) return alert("Le fichier project.json est manquant");
        const jsonText = await jsonFile.async("string");
        const json = JSON.parse(jsonText);
        editor.loadProjectData(json);
        const firstPage = editor.Pages.getAll()[0];
        if (firstPage) editor.Pages.select(firstPage.id);
        alert("Projet ZIP importé avec succès !");
      } catch {
        alert("Le fichier project.json est corrompu ou invalide");
      }
    } else {
      alert("Format non pris en charge (seuls .json ou .zip sont valides)");
    }
  };
  const [html, setHtml] = useState<string>("");
  const [css, setCss] = useState<string>("");
  useEffect(() => {
    if (editorRef.current && blocksRef.current && !editor) {
      blocksRef.current.innerHTML = "";

      const e = grapesjs.init({
        container: editorRef.current,
        height: "100vh",
        width: "100%",
        storageManager: {
          id: "gjs-",
          type: "local",
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1,
          storeComponents: false,
          storeStyles: false,
          storeHtml: true,
          storeCss: true,
        },
        fromElement: true,
        plugins: ["gjs-blocks-basic"],
        blockManager: {
          appendTo: blocksRef.current,
          blocks: [
            {
              id: "image",
              label: "Image",
              media: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 
                  20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,
                  2 0 0,0 21,19Z" />
              </svg>`,
              content: { type: "image" },
              activate: true,
            },
          ],
        },
        pageManager: {
          pages: [
            {
              id: "page-1",
              name: "Page 1",
              component: `<div class="p-10 text-lg text-red-600">Bienvenue sur la page 1</div>`,
            },
            {
              id: "page-2",
              name: "Page 2",
              component: `<div class="p-10 text-lg text-green-600">Bienvenue sur la page 2</div>`,
            },
          ],
        },
        canvas: {
          styles: DaisyUI,
        },
      });
        


      const updateCode = () => {
        setHtml(e.getHtml());
        setCss(e.getCss());
      };

      // Ajout des blocs DaisyUI
      const addBlock = (id: string, label: string, content: string) => {
        if (!e.BlockManager.get(id)) {
          e.BlockManager.add(id, {
            label,
            category: "DaisyUI",
            content,
          });
        }
      };

      addBlock(
        "daisy-hero",
        "Hero",
        `<div class="hero min-h-screen bg-base-200">
          <div class="hero-content text-center">
            <div class="max-w-md">
              <h1 class="text-5xl font-bold">Bienvenue</h1>
              <p class="py-6">DaisyUI intégré à GrapesJS !</p>
              <button class="btn btn-primary">Commencer</button>
            </div>
          </div>
        </div>`
      );
 

      addBlock(
        "daisy-tabs",
        "Tabs",
        `<div role="tablist" class="tabs tabs-boxed">
          <a role="tab" class="tab tab-active">Tab 1</a>
          <a role="tab" class="tab">Tab 2</a>
          <a role="tab" class="tab">Tab 3</a>
        </div>`
      );
 
      const pm = e.Pages;
      setEditor(e);
      setPages(pm.getAll());
      setSelectedPageId(pm.getSelected()?.id || null);

      e.on("page", () => {
        setPages(pm.getAll());
        setSelectedPageId(pm.getSelected()?.id || null);
      });
      e.on("canvas:drop", updateCode);
    }
  }, [editor]);

  // Sauvegarde locale simple
  const handleSave = () => {
    if (editor) {
      editor.store().then((json: any) => {
        localStorage.setItem("my-ui-design-app", JSON.stringify(json));
        alert("Projet sauvegardé dans localStorage !");
      });
    }
  };

  // Sélection page
  const selectPage = (id: string) => {
    if (editor) editor.Pages.select(id);
  };

  // Suppression page
  const removePage = (id: string) => {
    if (editor) editor.Pages.remove(id);
  };

  // Ajout page
  const addPage = () => {
    if (!editor) return;
    const newPage = editor.Pages.add({
      name: `Page ${pages.length + 1}`,
      component: `<div class="p-5 text-lg">Nouvelle page vide</div>`,
    });
    editor.Pages.select(newPage.id);
  };

  // Export ZIP avec JSON complet (avec await sur store)
  const handleExport = async () => {
    if (!editor) return;

    const zip = new JSZip();
    const html = editor.getHtml();
    const css = editor.getCss();
    const json = await editor.store(); // <-- ATTENTION ici : await !!

    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("project.json", JSON.stringify(json, null, 2));

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "grapesjs_project.zip");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Bloc des blocs */}
      <div
        ref={blocksRef}
        style={{
          width: 280,
          overflowY: "auto",
          borderRight: "1px solid #ccc",
          padding: 10,
        }}
      />

      {/* Panneau pages + contrôles */}
      <div
        style={{
          width: 240,
          padding: 10,
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <h3>Pages</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {pages.map((page) => (
            <li key={page.id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => selectPage(page.id)}
                style={{
                  width: "100%",
                  padding: "6px",
                  background:
                    page.id === selectedPageId ? "#6366f1" : "#e5e7eb",
                  color: page.id === selectedPageId ? "#fff" : "#000",
                  border: "none",
                  borderRadius: 4,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {page.get("name")}
              </button>
              <button
                onClick={() => removePage(page.id)}
                style={{
                  fontSize: 12,
                  marginTop: 2,
                  color: "red",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={addPage}
          style={{
            marginTop: 10,
            padding: 6,
            width: "100%",
            cursor: "pointer",
          }}
        >
          ➕ Ajouter une page
        </button>

        <button
          onClick={handleSave}
          style={{
            marginTop: 10,
            padding: 6,
            width: "100%",
            cursor: "pointer",
          }}
        >
          💾 Sauvegarder le projet
        </button>

        <hr style={{ margin: "15px 0" }} />

        <button
          onClick={handleExport}
          style={{
            padding: 6,
            width: "100%",
            cursor: "pointer",
          }}
        >
          📦 Exporter le projet
        </button>

        <input
          type="file"
          accept=".json,.zip"
          onChange={handleImport}
          style={{
            marginTop: 10,
            width: "100%",
            cursor: "pointer",
          }}
        />
          <div>{html  } df {css}</div>
      </div>
      {/* Zone d’édition GrapesJS */}
      <div ref={editorRef} style={{ flex: 1, overflow: "auto" }} />
    </div>
  );
};

export default DesignArea;
