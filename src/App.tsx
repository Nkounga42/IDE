import { useEffect, useState } from "react";
import EditionArea from "./pages/EditionArea";
import Sidebar, { SidePanel } from "./components/SideBar";
import Split from "react-split";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { NotificationBox } from "./components/NotificationBox";
import { PushNotification } from "./context/NotificationStore";
import { useNotification } from "./context/NotificationContext";
import Statusbar from "./components/Statusbar";
import ModeSwitcher from "./components/ModeSwitcher";
import Canvas from "./components/Designer/Canvas";
import { sampleNotifs } from "./sampleNotifs";
import OgletManager from "./components/OgletManager";
import { Play } from "lucide-react";

const template = ` <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li>`;

const App = () => {
  const [onglets, setOnglets] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const openFile = (fileNode: TreeNode) => {
    const id = fileNode.id;
    const label = fileNode.name;
    const content = fileNode.content || "";

    setOnglets((prev) => {
      const exists = prev.some((o) => o.id === id);
      if (!exists) {
        setActiveTab(id);
        return [
          ...prev,
          {
            id,
            label,
            content,
          },
        ];
      } else {
        setActiveTab(id);
        return prev;
      }
    });
  };

  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [mode, setMode] = useState("edition");
  const [language, setLanguage] = useState("text");
  const [theme, setTheme] = useState("vs-dark");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [editor, setEditor] = useState<grapesjs.Editor | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [activeSidePanel, setActiveSidePanel] = useState("explorer");
  const { notifications, removeNotification, clearNotifications } =
    useNotification();

  useEffect(() => {
    sampleNotifs.forEach(({ type, title, message }) => {
      PushNotification({ type, title, message });
    });
  }, []);

  useEffect(() => {
    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "light" : "dark");

    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "light" : "vs-dark");
    };

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", listener);

    return () => {
      mq.removeEventListener("change", listener);
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full flex flex-col bg-base-100 overflow-hidden relative h-screen">
        <div className="justify-between items-center flex border-b border-base-200">
          <ModeSwitcher
            mode={mode}
            setMode={setMode}
            setActiveSidePanel={setActiveSidePanel}
          />
          <button className="btn btn-sm btn-primary btn-circle">
            <Play size={13} />
          </button>
        </div>

        <div className="h-full flex flex-row-reverse" hidden>
          <div className={mode === "edition" ? "hidden" : "w-full h-full"}>
            <Canvas setEditor={setEditor} />
          </div>
        </div>

        <div className="flex h-full w-full overflow-hidden">
          <Sidebar
            editor={editor}
            activeSidePanel={activeSidePanel}
            setActiveSidePanel={setActiveSidePanel}
            handleImport={undefined}
            openFile={openFile}
          />

          <Split
            className="flex flex- row w-full h-full "
            sizes={[30, 70]}
            minSize={[100, 200]}
            gutterSize={8}
            direction="horizontal"
            snapOffset={5}
            cursor="col-resize"
          >
            
              <OgletManager
                mode={mode}
                setCharCount={setCharCount}
                onglets={onglets}
                setOnglets={setOnglets}
                language={language}
                SetLanguage={setLanguage}
                activeTab={activeTab}
                setCursorLine={setCursorLine}
                setLineNumbers={setLineNumbers}
                setCursorCol={setCursorCol}
                setActiveTab={setActiveTab}
              />
            
          </Split>
        </div>

        {/* Status bar */}
        <Statusbar
          charCount={charCount}
          cursorLine={cursorLine}
          cursorCol={cursorCol}
          notifications={notifications.length}
          theme={theme}
          language={language}
          lineNumbers={lineNumbers}
          setNotificationVisible={setNotificationVisible}
          notificationVisible={notificationVisible}
        />

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
