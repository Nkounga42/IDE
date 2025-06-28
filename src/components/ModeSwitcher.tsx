import React from "react";
import { LayoutDashboard, Edit3, MoreHorizontal } from "lucide-react";

const modes = [
  { id: "edition", label: "Édition", Icon: Edit3 },
  { id: "design", label: "Design", Icon: LayoutDashboard },
  { id: "plus", label: "Plus", Icon: MoreHorizontal },
];

const languages = ["html", "css", "javascript", "json"];
const themes = ["vs-dark", "light", ];

type ModeSwitcherProps = {
  mode: string;
  setMode: (m: string) => void;
  setLanguage: (lang: string) => void;
  setTheme: (theme: string) => void;
};

const ModeSwitcher = ({ mode, setMode, setLanguage, setTheme }: ModeSwitcherProps) => {
  return (
    <div className="flex items-center gap-2 px-2">
      {/* Boutons de mode */}
      <div className="p-1 flex join">
        {modes.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`btn btn-sm h-7 w-10 join-item ${
              mode === id ? "btn-primary" : "btn-ghost"
            } flex items-center justify-center`}
            onClick={() => setMode(id)}
            name="mode"
            aria-label={id}
            title={label}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* Sélecteur de langage */}
      <select
        onChange={(e) => setLanguage(e.target.value)}
        className="select select-sm focus:outline-none  border-base-content/10 /50"
        defaultValue="html"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Sélecteur de thème */}
      <select
        onChange={(e) => setTheme(e.target.value)}
        className="select select-sm focus:outline-none border-base-content/10 /50"
        defaultValue="vs-dark"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModeSwitcher;
