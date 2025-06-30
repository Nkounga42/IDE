import { useEffect, useRef, useState } from "react";
import type { Notification } from "../context/NotificationContext";
import {
  AlertTriangle,
  BellOff,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  ListX,
  Settings,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";

type NotificationBoxProps = {
  notificationVisible: boolean;
  setNotificationVisible: (visible: boolean) => void;
  notifications: Notification[];
  onClear?: () => void;
  onRemove: (id: number) => void;
  onSettingsClick?: () => void;
};

const typeColors: Record<Notification["type"], string> = {
  info: "bg-info/70 text-info-content",
  warning: "bg-warning/70 text-warning-content",
  error: "bg-error/70 text-error-content",
  success: "bg-success/70 text-success-content",
};

const getIconByType = (
  type: "info" | "success" | "warning" | "error"
): LucideIcon => {
  switch (type) {
    case "info":
      return Info;
    case "success":
      return CheckCircle;
    case "warning":
      return AlertTriangle;
    case "error":
      return XCircle;
    default:
      return Info;
  }
};

export const NotificationBox = ({
  notificationVisible,
  setNotificationVisible,
  notifications,
  onClear,
  onRemove,
  onSettingsClick,
}: NotificationBoxProps) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ Fermer la boîte si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationVisible &&
        boxRef.current &&
        !boxRef.current.contains(event.target as Node)
      ) {
        setNotificationVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationVisible]);

  return (
    <div
      ref={boxRef}
      className={`w-72 transition-all duration-200 overflow-hidden border border-base-100/70 absolute ${
        notificationVisible ? "bottom-8 opacity-100" : "-bottom-full opacity-0"
      } right-2 bg-base-300 rounded-md shadow-md z-50`}
    >
      <div className="border-b border-base-100/50 px-2 py-1 font-semibold flex items-center justify-between space-x-2">
        <span className="text-sm">Notifications</span>
        <div className="flex items-center space-x-1">
          <button
            className="btn btn-sm btn-ghost h-6 w-6 p-0 tooltip"
            onClick={onClear}
            data-tip="Tout effacer"
          >
            <BellOff size={13} />
          </button>
          <button
            className="btn btn-sm btn-ghost h-6 w-6 p-0 tooltip"
            onClick={onSettingsClick}
            data-tip="Paramètres"
          >
            <Settings size={14} />
          </button>
          <button
            className="btn btn-sm btn-ghost h-6 w-6 p-0 tooltip"
            onClick={() => setNotificationVisible(false)}
            data-tip="Fermer"
          >
            <ListX size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-60 bg-base-100/30 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(({ id, type, title, message }) => {
            const isExpanded = expandedIds.includes(id);
            const Icon = getIconByType(type);
            const iconColor = typeColors[type];

            return (
              <div
                key={id}
                className="flex justify-between items-start gap-2 p-2 text-sm border-b border-base-100/30 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-1">
                    <div className="flex items-start gap-2 font-semibold max-w-52">
                      <div className={`p-1 rounded-full ${iconColor}`}>
                        <Icon size={14} />
                      </div>
                      {title}
                    </div>
                    <div>
                      <button
                        onClick={() => toggleExpand(id)}
                        className="btn btn-xs btn-ghost h-5 w-5 p-0"
                        data-tip={isExpanded ? "Réduire" : "Développer"}
                      >
                        {isExpanded ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </button>
                      <button
                        onClick={() => onRemove(id)}
                        className="btn btn-xs btn-ghost h-5 w-5 p-0"
                        data-tip="Supprimer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`text-sm text-base-content/50 ml-8 mt-1 overflow-hidden transition ${
                      isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {message}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm p-2 text-base-content/30 w-full">
            Vous n'avez aucune notification pour le moment
          </div>
        )}
      </div>
    </div>
  );
};
