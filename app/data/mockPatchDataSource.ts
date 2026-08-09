import type { PatchDataSource } from "@/app/data/patchDataSource";
import type { ChampionChanges, PatchData } from "@/app/types/patch";
import patch2614 from "@/app/data/mock/patch_26.14_classified.json";

const MOCK_PATCHES: Record<string, PatchData> = {
  [patch2614.patch_version]: patch2614 as PatchData,
};

export class MockPatchDataSource implements PatchDataSource {
  async getChampionChanges(patchVersion: string): Promise<ChampionChanges[]> {
    const patch = MOCK_PATCHES[patchVersion];
    if (!patch) return [];

    const order: string[] = [];
    const grouped = new Map<string, ChampionChanges>();

    for (const change of patch.changes) {
      if (change.entity_type !== "champion") continue;
      let entry = grouped.get(change.entity_name);
      if (!entry) {
        entry = { championName: change.entity_name, changes: [] };
        grouped.set(change.entity_name, entry);
        order.push(change.entity_name);
      }
      entry.changes.push(change);
    }

    return order.map((name) => grouped.get(name)!);
  }
}
