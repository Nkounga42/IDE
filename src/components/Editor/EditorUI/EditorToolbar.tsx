// src/components/EditorUI/EditorToolbar.tsx
import React from "react";
import { languageOptions, themeOptions } from "../EditorCommands";

type EditorToolbarProps = {
  theme: string;
  language: string;
  onThemeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
};

const EditorToolbar = ({
  theme,
  language,
  onThemeChange,
  onLanguageChange,
}: EditorToolbarProps) => {
  return (
    <div className="flex items-center gap-6 bg-base-200 p-1">
      {/* Thème */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Thème</span>
        </label>
        <select
          className="select select-bordered select-sm w-48"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
        >
          {themeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Langage */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Langage</span>
        </label>
        <select
          className="select select-bordered select-sm w-48"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EditorToolbar;
