import React, { useState } from "react";

type Prop = {
  name: string;
  type: string;
  units?: string[];
  min?: number;
  max?: number;
  defaultUnit?: string;
  options?: string[];
};

type SectorProps = {
  sector: {
    name: string;
    open: boolean;
    properties: Prop[];
  };
  styles: Record<string, string>;
  onChange: (propName: string, value: string) => void;
};

const StyleSector = ({ sector, styles, onChange }: SectorProps) => {
  const [isOpen, setIsOpen] = useState(sector.open);

  return (
    <div className="border-b border-base-200 mb-2">
      <button
        className="w-full text-left font-semibold p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {sector.name}
      </button>
      {isOpen && (
        <div className="p-2 space-y-4">
          {sector.properties.map((prop) => {
            const value = styles[prop.name] || "";
            if (prop.type === "integer") {
              const [val, unit] = (() => {
                const match = /^([\d\.]+)([a-z%]*)$/i.exec(value);
                return match ? [match[1], match[2] || prop.defaultUnit || "px"] : ["", prop.defaultUnit || "px"];
              })();

              return (
                <div key={prop.name}>
                  <label className="block mb-1 font-medium">{prop.name}</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min={prop.min}
                      max={prop.max}
                      value={val}
                      onChange={(e) => onChange(prop.name, `${e.target.value}${unit}`)}
                      className="input input-bordered flex-grow"
                    />
                    <select
                      value={unit}
                      onChange={(e) => onChange(prop.name, `${val}${e.target.value}`)}
                      className="select select-bordered w-24"
                    >
                      {prop.units?.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            }
            if (prop.type === "color") {
              return (
                <div key={prop.name}>
                  <label className="block mb-1 font-medium">{prop.name}</label>
                  <input
                    type="color"
                    value={value || "#000000"}
                    onChange={(e) => onChange(prop.name, e.target.value)}
                    className="w-full h-8 cursor-pointer"
                  />
                </div>
              );
            }
            if (prop.type === "select") {
              return (
                <div key={prop.name}>
                  <label className="block mb-1 font-medium">{prop.name}</label>
                  <select
                    value={value}
                    onChange={(e) => onChange(prop.name, e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="">--</option>
                    {prop.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            // type text ou autre
            return (
              <div key={prop.name}>
                <label className="block mb-1 font-medium">{prop.name}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(prop.name, e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StyleSector;
