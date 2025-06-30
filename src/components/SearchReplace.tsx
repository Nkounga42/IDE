import React, { useState } from "react";
import {
  Search,
  Replace,
  ReplaceAll,
  ArrowDown,
  ArrowUp,
  CaseSensitive,
} from "lucide-react";

const SearchReplace = () => {
  const [content, setContent] = useState(
    "Voici un exemple de texte. Ce texte peut être remplacé plusieurs fois dans ce texte."
  );
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [matchIndices, setMatchIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const updateMatches = (value: string) => {
    if (!value) {
      setMatchIndices([]);
      setCurrentIndex(0);
      return;
    }

    const indices: number[] = [];
    let pos = 0;

    const baseContent = ignoreCase ? content.toLowerCase() : content;
    const baseValue = ignoreCase ? value.toLowerCase() : value;

    while (true) {
      const index = baseContent.indexOf(baseValue, pos);
      if (index === -1) break;
      indices.push(index);
      pos = index + baseValue.length;
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
    const newContent = content.slice(0, start) + replace + content.slice(end);

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
    setCurrentIndex((i) => (i - 1 + matchIndices.length) % matchIndices.length);
  };

  return (
    <div className="p-1 max-w-57">
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
            <button
              className="btn btn-sm join-item tooltip tooltip-right"
              onClick={prevMatch}
              data-tip="Previous Match"
            >
              <ArrowUp size={16} />
            </button>
            <button
              className="btn btn-sm join-item tooltip"
              onClick={nextMatch}
              data-tip="Next Match"
            >
              <ArrowDown size={16} />
            </button>
            <button
              className="btn btn-sm join-item tooltip"
              onClick={handleReplaceOne}
              data-tip="Replace One"
            >
              <Replace size={16} />
            </button>
            <button
              className="btn btn-sm join-item tooltip"
              onClick={handleReplaceAll}
              data-tip="Replace All"
            >
              <ReplaceAll size={16} />
            </button>

            <button
              className={`btn btn-sm join-item tooltip tooltip-left ${
                ignoreCase && "bg-primary"
              } `}
              data-tip="Ignore Case"
              onClick={() => {
                setIgnoreCase((prev) => {
                  const newVal = !prev;
                  updateMatches(search); // re-search with new mode
                  return newVal;
                });
              }}
            >
              <CaseSensitive size={16} />
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
              className={
                isInMatch ? "bg-secondary/30 text-black font-bold" : ""
              }
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
