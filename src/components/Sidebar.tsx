import React, { useState } from "react";
import {
  FilePlus,
  Search,
  GitBranch,
  Settings,
} from "lucide-react";

type SidebarItem = {
  label: string;
};

const Element: SidebarItem[] = [
  { label: "Home" },
  { label: "Dashboard" },
  { label: "Projects" },
  { label: "Messages" },
  { label: "Settings" },
];

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("explorer");
  const [activeElementIndex, setActiveElementIndex] = useState<number | null>(null);

  const items = [
    { id: "explorer", icon: <FilePlus size={20} />, label: "Explorer" },
    { id: "search", icon: <Search size={20} />, label: "Rechercher" },
    { id: "git", icon: <GitBranch size={20} />, label: "Git" },
    { id: "settings", icon: <Settings size={20} />, label: "Paramètres" },
  ];

  return (
    <div className="flex bg-base-200 text-base-content transition-all duration-300 h-screen">
      {/* Sidebar navigation */}
      <nav className="flex flex-col border-r border-base-100/50">
        {items.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`border-l-2 border-0 btn btn-square btn-ghost rounded-none h-11 w-11 transition-colors duration-150 ${
              activeSection === id ? "border-primary" : "border-transparent"
            }`}
            title={label}
          >
            {icon}
          </button>
        ))}
      </nav>

      {/* Sidebar content */}
      <div className="w-48 flex flex-col">
        {Element.map((item, index) => (
          <div
            key={index}
            className={`px-4 py-2 cursor-pointer text-left hover:bg-base-100/20 transition ${
              activeElementIndex === index ? "bg-base-300 font-bold" : ""
            }`}
            onClick={() => setActiveElementIndex(index)}
            title={item.label}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
