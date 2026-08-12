import type { ChampionChanges } from "@/app/types/patch";

export interface PatchDataSource {
  getChampionChanges(patchVersion: string): Promise<ChampionChanges[]>;
}
