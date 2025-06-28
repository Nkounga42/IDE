import React, { useState } from "react";
import {
  Search,
  Replace,
  ReplaceAll,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

const SearchReplace = () => {
  const [content, setContent] = useState(
    "Voici un exemple de texte. Ce texte peut être remplacé plusieurs fois dans ce texte."
  );
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [matchIndices, setMatchIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateMatches = (value: string) => {
    const indices = [];
    let pos = 0;
    while (true) {
      const index = content.indexOf(value, pos);
      if (index === -1) break;
      indices.push(index);
      pos = index + value.length;
    }
    setMatchIndices(indices);
    setCurrentIndex(0);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    updateMatches(value);
  };

  const handleReplaceOne = () => {
    if (!search || matchIndices.length === 0) return;

    const start = matchIndices[currentIndex];
    const end = start + search.length;
    const newContent =
      content.slice(0, start) + replace + content.slice(end);

    setContent(newContent);
    updateMatches(search);
  };

  const handleReplaceAll = () => {
    const newContent = content.split(search).join(replace);
    setContent(newContent);
    updateMatches(search);
  };

  const nextMatch = () => {
    setCurrentIndex((i) => (i + 1) % matchIndices.length);
  };

  const prevMatch = () => {
    setCurrentIndex((i) =>
      (i - 1 + matchIndices.length) % matchIndices.length
    );
  };

  return (
    <div className="p-1">
      <div className="flex flex-wrap items-end gap-1">
        <div className="form-control flex gap-2 flex">
          <label className="label">
            <span className="label-text flex items-center gap-1">
              <Search size={16} /> 
            </span>
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="input input-bordered input-sm w-full"
            placeholder="mot à chercher"
          />
        </div>

        <div className="form-control flex gap-2 flex">
          <label className="label">
            <span className="label-text flex items-center gap-1">
              <Replace size={16} /> 
            </span>
          </label>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            className="input input-bordered input-sm w-full"
            placeholder="remplaçant"
          />
        </div>

        <div className="flex justify-center items-center   w-full">
          <div className="flex join justify-center">
            <button className="btn btn-sm join-item" onClick={prevMatch}>
              <ArrowUp size={16} />
            </button>
            <button className="btn btn-sm join-item" onClick={nextMatch}>
              <ArrowDown size={16} />
            </button>
            <button className="btn btn-sm join-item " onClick={handleReplaceOne}>
              <Replace size={16} /> 
            </button>
            <button className="btn btn-sm join-item " onClick={handleReplaceAll}>
              <ReplaceAll size={16} /> 
            </button>
          </div>
        </div>
      </div>

      <div className="p-2 mt-2 bg-base-200   text-sm">
        {content.split("").map((char, i) => {
          const isInMatch =
            matchIndices[currentIndex] !== undefined &&
            i >= matchIndices[currentIndex] &&
            i < matchIndices[currentIndex] + search.length;
          return (
            <span
              key={i}
              className={isInMatch ? "bg-secondary/30 text-black font-bold" : ""}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SearchReplace;
