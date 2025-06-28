import { useEffect, useRef, useState } from "react";
import EditionArea from "./pages/EditionArea";
import Sidebar, { SidePanel } from "./components/SideBar";
import Split from "react-split";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { NotificationBox } from "./components/NotificationBox";
import { PushNotification } from "./context/NotificationStore";
import { useNotification } from "./context/NotificationContext";
import Statusbar from "./components/Statusbar";
import CodeEditor from "./components/Editor/CodeEditor";
import ModeSwitcher from "./components/ModeSwitcher";
import Canvas from "./components/Designer/Canvas";
import { sampleNotifs } from "./sampleNotifs"; // Assurez-vous que ce fichier existe
import OgletManager from "./components/OgletManager";

const template = ` <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>`;

const App = () => {
  // const [dragMode, setDragMode] = useState(false);

  const [mode, setMode] = useState("edition");
  const [htmlCode, setHtmlCode] = useState(template);
  const [language, setLanguage] = useState("Html");
  const [theme, setTheme] = useState("light");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [editor, setEditor] = useState<grapesjs.Editor | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [activeSection, setActiveSection] = useState("explorer");
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
    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");

    // Écoute les changements du thème système en temps réel
    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", listener);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", listener);
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
          <ModeSwitcher
            mode={mode}
            setMode={setMode}
            setLanguage={setLanguage}
            setTheme={setTheme}
          />
        </div>

        <div className="h-full flex flex -row -reverse" hidden>
          <div className={mode === "edition" ? "hidden" : "w-full h-full"}>
            <Canvas setEditor={setEditor} />
          </div>{" "}
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
        </div>
        <div className="flex h-full w-full">
          <Sidebar
            editor={editor}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            handleImport={undefined}
            handleExport={undefined}
          />
          <div className="flex h-full w-full">
            <Split
              className="split"
              // minSize={[150, 150]}
              sizes={[35, 650]}          // définit les tailles en pourcentage
              minSize={[170, 300]} 
              gutterSize={5}
              gutterAlign="start"
              direction="horizontal"
              style={{ height: "100%", width: "100%" }}
            >
              <SidePanel activeSection={activeSection} editor={editor} />

              {mode === "edition" ? (
                <OgletManager />
              ) : (
                <div className="w-full h-full" >
                  <CodeEditor
                    language={language}
                    theme={theme}
                    code={htmlCode}
                    setCharCount={setCharCount}
                    onContentChange={(html: string) => {
                      setHtmlCode(html);
                      if (
                        editor &&
                        typeof editor.setComponents === "function"
                      ) {
                        editor.setComponents(html);
                        editor.setStyle("");
                      }
                    }}
                  />
                </div>
              )}
            </Split>
          </div>
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
