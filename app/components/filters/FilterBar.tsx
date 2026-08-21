"use client";

import type { ChangeType } from "@/app/types/patch";
import { CHANGE_TYPES, CHANGE_TYPE_LABELS } from "@/app/utils/changeType";
import ToggleChipGroup from "@/app/components/filters/ToggleChipGroup";
import PillMultiSelect from "@/app/components/filters/PillMultiSelect";

export interface FilterBarProps {
  championOptions: string[];
  selectedChampions: string[];
  onChampionsChange: (next: string[]) => void;
  selectedChangeTypes: ChangeType[];
  onChangeTypesChange: (next: ChangeType[]) => void;
}

const CHANGE_TYPE_OPTIONS = CHANGE_TYPES.map((value) => ({
  value,
  label: CHANGE_TYPE_LABELS[value],
}));

export default function FilterBar({
  championOptions,
  selectedChampions,
  onChampionsChange,
  selectedChangeTypes,
  onChangeTypesChange,
}: FilterBarProps) {
  const hasActiveFilters = selectedChampions.length > 0 || selectedChangeTypes.length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Champion</span>
          <PillMultiSelect
            options={championOptions}
            selected={selectedChampions}
            onChange={onChampionsChange}
            placeholder="Search champions..."
          />
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              onChampionsChange([]);
              onChangeTypesChange([]);
            }}
            className="mt-5 text-xs font-medium text-zinc-500 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Clear filters
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Change type</span>
        <ToggleChipGroup
          options={CHANGE_TYPE_OPTIONS}
          selected={selectedChangeTypes}
          onChange={onChangeTypesChange}
        />
      </div>
    </div>
  );
}
