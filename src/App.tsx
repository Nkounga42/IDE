import { useEffect, useRef, useState } from "react";
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

import { NotificationBox } from "./components/NotificationBox";
import { PushNotification } from "./context/NotificationStore";
import { useNotification } from "./context/NotificationContext";
import Statusbar from "./components/Statusbar";
import CodeEditor from "./components/codeEditor/CodeEditor";

const App = () => {
  // const [dragMode, setDragMode] = useState(false);
  const [inspector, setInspector] = useState<{ html: number; css: number }>({
    html: 0,
    css: 0,
  });
  
  const [notificationVisible, setNotificationVisible] = useState(false);

  const { notifications, removeNotification, clearNotifications } = useNotification();

  useEffect(() => {
    const sampleNotifs = [
    { type: "error", title: "Erreur de compilation", message: "Une erreur est survenue lors de la compilation. Veuillez vérifier votre code." },
    { type: "info", title: "Mise à jour disponible", message: "Une nouvelle version de l’éditeur est disponible. Cliquez ici pour la découvrir." },
    { type: "success", title: "Sauvegarde réussie", message: "Votre projet a été sauvegardé avec succès dans le cloud." },
    { type: "warning", title: "Connexion instable", message: "La connexion réseau est instable. Les changements pourraient ne pas être sauvegardés." },
    { type: "error", title: "Erreur serveur", message: "Le serveur n’a pas répondu. Veuillez réessayer plus tard." },
    { type: "info", title: "Mode hors-ligne activé", message: "Vous êtes en mode hors-ligne. Les changements seront synchronisés plus tard." },
    { type: "success", title: "Publication réussie", message: "Votre site a été publié avec succès. Il est maintenant accessible en ligne." },
    { type: "warning", title: "Changements non sauvegardés", message: "Vous avez des modifications non sauvegardées. Pensez à les enregistrer." },
    { type: "info", title: "Bienvenue !", message: "Bienvenue dans votre nouvel environnement de développement." },
    { type: "success", title: "Exportation terminée", message: "Votre projet a été exporté avec succès au format ZIP." },
  ];

  sampleNotifs.forEach(({ type, title, message }) => {
    PushNotification({
      type,
      title,
      message, 
    });
  });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-full flex flex-col bg-base-200 overflow-hidden relative">
        <div className="p-1">
          header
        </div>
        <div className="h-full flex">
          <Sidebar
            editor={undefined}
            handleImport={undefined}
            handleExport={undefined}
          />
          <div className="bg-base-100 w-full">
            <CodeEditor />
            {/* <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />;  */}
          </div>
        </div>
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
