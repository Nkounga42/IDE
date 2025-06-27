
// src/components/EditorUI/EditorToolbar.tsx
import React from "react";
import { languageOptions, themeOptions } from "../EditorCommands";

type EditorToolbarProps = {
  theme: string;
  language: string;
  onThemeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
};

const EditorToolbar = ({ theme, language, onThemeChange, onLanguageChange }: EditorToolbarProps) => {
  return (
    <div style={{ display: "flex", gap: "16px", padding: "8px", background: "#222" }}>
      <div style={{ color: "#fff" }}>
        Thème :
        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {themeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div style={{ color: "#fff" }}>
        Langage :
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EditorToolbar;
