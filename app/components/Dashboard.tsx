"use client";

import { useMemo } from "react";
import type { ChampionChanges } from "@/app/types/patch";
import ChampionChangeCard from "@/app/components/ChampionChangeCard";
import FilterBar from "@/app/components/filters/FilterBar";
import { useUrlFilter } from "@/app/hooks/useUrlFilter";
import { changeTypeFilter, championFilter } from "@/app/lib/filters/definitions";
import { applyFilters } from "@/app/lib/filters/apply";

export interface DashboardProps {
  championChanges: ChampionChanges[];
}

export default function Dashboard({ championChanges }: DashboardProps) {
  const [changeTypes, setChangeTypes] = useUrlFilter(changeTypeFilter);
  const [champions, setChampions] = useUrlFilter(championFilter);

  const championOptions = useMemo(
    () => championChanges.map((cc) => cc.championName).sort((a, b) => a.localeCompare(b)),
    [championChanges]
  );

  const filteredChampionChanges = useMemo(
    () => applyFilters(championChanges, { changeTypes, champions }),
    [championChanges, changeTypes, champions]
  );

  return (
    <>
      <FilterBar
        championOptions={championOptions}
        selectedChampions={champions}
        onChampionsChange={setChampions}
        selectedChangeTypes={changeTypes}
        onChangeTypesChange={setChangeTypes}
      />
      {filteredChampionChanges.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChampionChanges.map((cc) => (
            <ChampionChangeCard key={cc.championName} championChanges={cc} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No champion changes match the selected filters.
        </p>
      )}
    </>
  );
}
