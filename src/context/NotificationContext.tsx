import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { setNotificationHandler } from "./NotificationStore";

// Définition du type Notification
export type Notification = {
  id: number;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
  initialized: boolean;
};

// Création du contexte
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook personnalisé
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

// Provider
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [initialized, setInitialized] = useState(false);
  const idCounter = useRef(0); // compteur sécurisé

  // Ajout avec auto-dismiss
  const addNotification = (notif: Omit<Notification, "id">) => {
    idCounter.current += 1;
    const id = idCounter.current;
    const newNotification: Notification = { ...notif, id };

    setNotifications((prev) => [...prev, newNotification]);

     
  };

  // Suppression d'une seule notif
  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Suppression de toutes les notifs
  const clearNotifications = () => setNotifications([]);

  // Initialisation du handler global
  useEffect(() => {
    setNotificationHandler(addNotification);
    setInitialized(true);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        initialized,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
