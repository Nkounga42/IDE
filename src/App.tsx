import { useEffect, useRef, useState } from "react";
import EditionArea from "./pages/EditionArea";
import Sidebar from "./components/SideBar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { NotificationBox } from "./components/NotificationBox";
import { PushNotification } from "./context/NotificationStore";
import { useNotification } from "./context/NotificationContext";
import Statusbar from "./components/Statusbar";
import CodeEditor from "./components/Editor/CodeEditor";
import ModeSwitcher from "./components/ModeSwitcher";
import Canvas from "./components/Designer/Canvas";
import {sampleNotifs} from "./sampleNotifs"; // Assurez-vous que ce fichier existe 

const template = `<ul class="list bg-base-100 rounded-box shadow-md">
  
  <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>
  
  <li class="list-row">
    <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp"/></div>
    <div>
      <div>Dio Lupa</div>
      <div class="text-xs uppercase font-semibold opacity-60">Remaining Reason</div>
    </div>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
    </button>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
    </button>
  </li>
  
  <li class="list-row">
    <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp"/></div>
    <div>
      <div>Ellie Beilish</div>
      <div class="text-xs uppercase font-semibold opacity-60">Bears of a fever</div>
    </div>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
    </button>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
    </button>
  </li>
  
  <li class="list-row">
    <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/3@94.webp"/></div>
    <div>
      <div>Sabrino Gardener</div>
      <div class="text-xs uppercase font-semibold opacity-60">Cappuccino</div>
    </div>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
    </button>
    <button class="btn btn-square btn-ghost">
      <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
    </button>
  </li>
  
</ul>`

const App = () => {
  // const [dragMode, setDragMode] = useState(false);

  const [mode, setMode] = useState("edition");
  const [htmlCode, setHtmlCode] = useState(template);
  const [language, setLanguage] = useState("Html");
  const [theme, setTheme] = useState("light");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [editor, setEditor] = useState<grapesjs.Editor | null>(null);
  const [charCount, setCharCount] = useState(0);
  const { notifications, removeNotification, clearNotifications } =
    useNotification();
  const [inspector, setInspector] = useState<{ html: number; css: number }>({
    html: 0,
    css: 0,
  });    

  useEffect(() => {
   

    sampleNotifs.forEach(({ type, title, message }) => {
      PushNotification({
        type,
        title,
        message,
      });
    });
  }, []);


    useEffect(() => {
    // Vérifie le thème système
    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");

    // Écoute les changements du thème système en temps réel
    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);

    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
    };
  }, []);
  useEffect(() => {
    if (editor) {
      if (mode === "design") {
        if (editor && typeof editor.setComponents === "function") {
          editor.setComponents(htmlCode);
        }

        editor.setStyle(""); // Ajoute ton CSS ici si besoin
      }
    }
  }, [editor, mode]); // Ne pas inclure htmlCode ici, sinon ça réécrase à chaque frappe

  // useEffect(() => {
  //   if (mode === "edition" && editor) {
  //     const htmlFromCanvas = editor.getHtml();
  //     setHtmlCode(htmlFromCanvas);
  //   }
  // }, [editor, mode]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-full flex flex-col bg-base-100 overflow-hidden relative">
        <div className="justify-between flex border-b border-base-200">
          <ModeSwitcher mode={mode} setMode={setMode} setLanguage={setLanguage} setTheme={setTheme} />
        </div>
        <div className="h-full flex flex-row-reverse">
          <div className={mode === "edition" ? "hidden" : "w-full h-full"}>
            <Canvas setEditor={setEditor} />
          </div>

          {/* CodeEditor visible si mode édition */}
          {mode === "edition" && (
            <div className="w-full h-full" hidden>
              <CodeEditor
                language={language}
                theme={theme}
                code={htmlCode}
                setCharCount={setCharCount}
                onContentChange={(html: string) => {
                  setHtmlCode(html);
                  if (editor && typeof editor.setComponents === "function") {
                    editor.setComponents(html);
                    editor.setStyle("");
                  }
                }}
              />
            </div>
          )}
          <Sidebar
            editor={editor}
            handleImport={undefined}
            handleExport={undefined}
          />
        </div>
        {/* Barre d'état */}
        <Statusbar
          charCount={charCount}
          inspector={inspector}
          notifications={notifications.length}
          setNotificationVisible={setNotificationVisible}
          notificationVisible={notificationVisible}
        />

        {/* Notifications */}
        <NotificationBox
          notificationVisible={notificationVisible}
          setNotificationVisible={setNotificationVisible}
          notifications={notifications}
          onClear={clearNotifications}
          onRemove={removeNotification}
          onSettingsClick={() => alert("Paramètres ouverts")}
        />
      </div>
    </DndProvider>
  );
};

export default App;
