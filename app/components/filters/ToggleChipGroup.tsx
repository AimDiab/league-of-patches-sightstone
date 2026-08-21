"use client";

export interface ToggleChipGroupOption<T extends string> {
  value: T;
  label: string;
}

export interface ToggleChipGroupProps<T extends string> {
  options: ToggleChipGroupOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
}

export default function ToggleChipGroup<T extends string>({
  options,
  selected,
  onChange,
}: ToggleChipGroupProps<T>) {
  const toggle = (value: T) => {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    );
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(option.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              isSelected
                ? "border-black bg-black text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black"
                : "border-black/[.15] bg-white text-zinc-700 hover:border-black/30 dark:border-white/[.2] dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-white/40"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
