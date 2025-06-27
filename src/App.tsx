import { useEffect, useState } from "react";
import EditionArea from "./pages/EditionArea";
import Sidebar from "./components/SideBar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  Bell,
  BellDot,
  BellOff,
  ChevronDown,
  ChevronUp,
  ListX,
  X,
  Settings,
} from "lucide-react";

import { useNotification } from "./context/NotificationContext";
import { NotificationBox } from "./components/NotificationBox";

const App = () => {
  const [dragMode, setDragMode] = useState(false);
  const [inspector, setInspector] = useState<{ html: number; css: number }>({
    html: 0,
    css: 0,
  });
  const [notificationVisible, setNotificationVisible] = useState(true);

  const {
    notifications,
    removeNotification,
    clearNotifications,
    addNotification,
  } = useNotification();

  useEffect(() => {
    addNotification({
      type: "info",
      icon: Bell,
      title: "Mise à jour",
      message: "Une mise à jour est disponible pour l’éditeur.",
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-full flex flex-col bg-base-200 overflow-hidden relative">
        <Sidebar
          editor={undefined}
          handleImport={undefined}
          handleExport={undefined}
        />

        {/* Barre d'état */}
        <Statusbar
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

// --------------------- Composant Statusbar ---------------------

const Statusbar = ({
  inspector,
  notifications,
  notificationVisible,
  setNotificationVisible,
}: {
  inspector: { html: number; css: number };
  notifications: number;
  notificationVisible: boolean;
  setNotificationVisible: (visible: boolean) => void;
}) => {
  return (
    <div className="h-6 px-4 flex items-center justify-between text-[12px] bg-base-300 text-base-content border-t border-base-200">
      <div className="space-x-2">
        <span>HTML: {inspector.html}</span>
        <span>CSS: {inspector.css}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="btn btn-sm btn-ghost h-6 w-6 rounded-none p-0"
          onClick={() => setNotificationVisible(!notificationVisible)}
        >
          {notifications > 0 ? <BellDot size={13} /> : <Bell size={13} />}
        </button> 
      </div>
    </div>
  );
};

// --------------------- Composant NotificationBox ---------------------

