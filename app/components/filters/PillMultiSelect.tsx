"use client";

import { useMemo, useState, type KeyboardEvent } from "react";

export interface PillMultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

const MAX_SUGGESTIONS = 8;

export default function PillMultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: PillMultiSelectProps) {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    const query = input.trim().toLowerCase();
    return options
      .filter((option) => !selected.includes(option))
      .filter((option) => query === "" || option.toLowerCase().includes(query))
      .slice(0, MAX_SUGGESTIONS);
  }, [options, selected, input]);

  const addOption = (option: string) => {
    onChange([...selected, option]);
    setInput("");
  };

  const removeOption = (option: string) => {
    onChange(selected.filter((value) => value !== option));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (suggestions.length > 0) {
        addOption(suggestions[0]);
      }
    } else if (event.key === "Backspace" && input === "" && selected.length > 0) {
      removeOption(selected[selected.length - 1]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-black/[.15] bg-white p-2 focus-within:border-black/40 dark:border-white/[.2] dark:bg-zinc-900 dark:focus-within:border-white/40">
        {selected.map((option) => (
          <span
            key={option}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {option}
            <button
              type="button"
              aria-label={`Remove ${option} filter`}
              onClick={() => removeOption(option)}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="min-w-[8ch] flex-1 bg-transparent text-sm text-black outline-none placeholder:text-zinc-400 dark:text-zinc-50"
        />
      </div>
      {isOpen && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute top-full z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-black/[.15] bg-white py-1 shadow-lg dark:border-white/[.2] dark:bg-zinc-900"
        >
          {suggestions.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(event) => {
                  event.preventDefault();
                  addOption(option);
                }}
                className="w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
