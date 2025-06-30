import React from "react";
import { LayoutDashboard, Edit3, MoreHorizontal } from "lucide-react";

const modes = [
  { id: "edition", label: "Édition", Icon: Edit3 },
  { id: "design", label: "Design", Icon: LayoutDashboard },
  { id: "plus", label: "Plus", Icon: MoreHorizontal },
];

 
type ModeSwitcherProps = {
  mode: string;
  setMode: (m: string) => void; 
  setActiveSidePanel : any
};

const ModeSwitcher = ({ mode, setMode, setActiveSidePanel  }: ModeSwitcherProps) => {

  const handleClick = (id: string) => {
    setMode(id)
    id === "design" && setActiveSidePanel("component")
  }
  return (
    <div className="flex items-center gap-2 px-2 h-10">
      <div className="p-1 flex join">
        {modes.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`btn btn-sm h-7 w-10 join-item tooltip tooltip-bottom ${
              mode === id ? "btn-primary" : "btn-base-100"
            } flex items-center justify-center`}
            onClick={() => handleClick(id)}
            name="mode"
            aria-label={id}
            data-tip={label}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

       
    </div>
  );
};

export default ModeSwitcher;
