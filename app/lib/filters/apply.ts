import type { ChampionChanges, ChangeType } from "@/app/types/patch";

export interface DashboardFilters {
  changeTypes: ChangeType[];
  champions: string[];
}

export function applyFilters(
  championChanges: ChampionChanges[],
  filters: DashboardFilters
): ChampionChanges[] {
  return championChanges
    .filter(
      (cc) => filters.champions.length === 0 || filters.champions.includes(cc.championName)
    )
    .filter(
      (cc) =>
        filters.changeTypes.length === 0 ||
        cc.changes.some((change) => filters.changeTypes.includes(change.change_type))
    );
}
