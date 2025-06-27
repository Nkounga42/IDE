import type { Notification } from "../context/NotificationContext";

type NotificationBoxProps = {
  notificationVisible: boolean;
  setNotificationVisible: (visible: boolean) => void;
  notifications: Notification[];
  onClear?: () => void;
  onRemove: (id: number) => void;
  onSettingsClick?: () => void;
};

const typeColors: Record<Notification["type"], string> = {
  info: "bg-blue-500/20 text-blue-700",
  warning: "bg-yellow-500/20 text-yellow-700",
  error: "bg-red-500/20 text-red-700",
  success: "bg-green-500/20 text-green-700",
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

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (!notificationVisible || notifications.length === 0) return null;

  return (
    <div className="min-w-64 max-w-sm transition-all duration-200 overflow-hidden border border-base-100/70 absolute bottom-8 right-2 bg-base-300 rounded-md shadow-md z-50">
      <div className="border-b border-base-100/50 px-2 py-1 font-semibold flex items-center justify-between space-x-2">
        <span className="text-sm">Notifications</span>
        <div className="flex items-center space-x-1">
          <button
            className="btn btn-sm btn-ghost h-6 w-6 p-0"
            onClick={() => setNotificationVisible(false)}
            title="Fermer"
          >
            <ListX size={15} />
          </button>
          <button
            className="btn btn-sm btn-ghost h-6 w-6 p-0"
            onClick={onClear}
            title="Tout effacer"
          >
            <BellOff size={13} />
          </button>
          <button
            className="btn btn-sm btn-ghost h-6 w-6 p-0"
            onClick={onSettingsClick}
            title="Paramètres"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {notifications.map(({ id, type, title, message, icon: Icon }) => {
          const isExpanded = expandedIds.includes(id);
          return (
            <div
              key={id}
              className={`flex justify-between items-start gap-2 p-2 text-sm border-b last:border-b-0 ${typeColors[type]}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Icon size={16} /> {title}
                </div>
                <div className="text-sm mt-1">
                  {isExpanded
                    ? message
                    : `${message.slice(0, 50)}${
                        message.length > 50 ? "..." : ""
                      }`}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 ml-2">
                <button
                  onClick={() => toggleExpand(id)}
                  className="btn btn-xs btn-ghost h-5 w-5 p-0"
                  title={isExpanded ? "Réduire" : "Développer"}
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
                  title="Supprimer"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
