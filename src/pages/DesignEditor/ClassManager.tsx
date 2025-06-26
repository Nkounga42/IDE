import React, { useEffect, useState, useRef, useReducer } from "react";
import ALL_TAILWIND_CLASSES from "./ALL_TAILWIND_CLASSES";
import { X } from "lucide-react";

const ClassManager = ({ editor }: { editor: grapesjs.Editor | null }) => {
  const [selected, setSelected] = useState<grapesjs.Component | null>(null);
  const [classInput, setClassInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [idValue, setIdValue] = useState("");
  const [titleValue, setTitleValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const sel = editor.getSelected();
      setSelected(sel);
      setIdValue(sel?.getAttributes().id || "");
      setTitleValue(sel?.getAttributes().title || "");
    };

    editor.on("component:selected", update);
    return () => {
      editor.off("component:selected", update);
    };
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClassInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClassInput(value);

    if (value.trim().length > 0) {
      const filteredSuggestions = ALL_TAILWIND_CLASSES.filter(
        (cls) =>
          cls.startsWith(value.toLowerCase()) &&
          !selected?.getClasses().includes(cls)
      ).slice(0, 10);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAddClass = () => {
    if (!selected || !classInput.trim()) return;
    const cls = classInput.trim();
    if (selected.getClasses().includes(cls)) return;

    selected.addClass(cls);
    selected.view?.render?.();
    forceUpdate();
    setClassInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRemoveClass = (cls: string) => {
    if (!selected) return;
    selected.removeClass(cls);
    selected.view?.render?.();
    forceUpdate();
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setClassInput(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setIdValue(id);
    selected?.addAttributes({ id });
    selected?.view?.render?.();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setTitleValue(title);
    selected?.addAttributes({ title });
    selected?.view?.render?.();
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-red-500 font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  if (!selected) {
    return (
      <div className="text-sm text-gray-500">Aucun composant sélectionné</div>
    );
  }

  const classes = [...new Set(selected.getClasses())];

  return (
    <div id="class-manager-panel" title="Gestionnaire de classes CSS" className="mb-4">
      <h4 className="font-semibold mb-2">Classes CSS</h4>

      <div className="relative flex gap-2 mb-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ajouter une classe Tailwind..."
          className="input input-sm input-bordered flex-grow pr-10"
          value={classInput}
          onChange={handleClassInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (suggestions.length > 0 && showSuggestions) {
                handleSelectSuggestion(suggestions[0]);
              } else {
                handleAddClass();
              }
            } else if (e.key === "Escape") {
              setShowSuggestions(false);
            }
          }}
          onFocus={() => {
            if (classInput.trim().length > 0 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <button type="button" className="btn btn-sm btn-primary" onClick={handleAddClass}>
          Ajouter
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full bg-base-100 border border-base-300 rounded-md shadow-lg mt-1 top-full max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                className="p-2 cursor-pointer hover:bg-base-200"
                onClick={() => handleSelectSuggestion(suggestion)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelectSuggestion(suggestion);
                }}
              >
                {highlightText(suggestion, classInput)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {classes.map((cls: string) => (
          <div key={cls} className="badge badge-outline gap-1 ">
            {cls}
            <button
              className="ml-1 "
              onClick={() => handleRemoveClass(cls)}
            >
              <X/>
            </button>
          </div>
        ))}
      </div>

      {/* === Champs ID et TITLE === */}
      <div className="flex flex-col gap-2">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">ID</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered"
            value={idValue}
            onChange={handleIdChange}
            placeholder="ex: hero-section"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Title</span>
          </div>
          <input
            type="text"
            className="input input-sm input-bordered"
            value={titleValue}
            onChange={handleTitleChange}
            placeholder="ex: Ma section principale"
          />
        </label>
      </div>
    </div>
  );
};

export default ClassManager;
