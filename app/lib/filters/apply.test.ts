import { applyFilters } from "@/app/lib/filters/apply";
import type { ChampionChanges } from "@/app/types/patch";

const azir: ChampionChanges = {
  championName: "Azir",
  changes: [
    { entity_name: "Azir", entity_type: "champion", change_type: "buff", summary: "Buff summary" },
    { entity_name: "Azir", entity_type: "champion", change_type: "bug_fix", summary: "Bug fix summary" },
  ],
};

const zed: ChampionChanges = {
  championName: "Zed",
  changes: [{ entity_name: "Zed", entity_type: "champion", change_type: "nerf", summary: "Nerf summary" }],
};

const championChanges = [azir, zed];

describe("applyFilters", () => {
  it("returns everything unchanged when no filters are set", () => {
    expect(applyFilters(championChanges, { changeTypes: [], champions: [] })).toEqual(championChanges);
  });

  it("keeps only the selected champions", () => {
    const result = applyFilters(championChanges, { changeTypes: [], champions: ["Zed"] });

    expect(result).toEqual([zed]);
  });

  it("keeps a champion's full change list when any change matches the selected change types", () => {
    const result = applyFilters(championChanges, { changeTypes: ["buff"], champions: [] });

    expect(result).toEqual([azir]);
  });

  it("combines champion and change type filters", () => {
    const result = applyFilters(championChanges, { changeTypes: ["nerf"], champions: ["Azir", "Zed"] });

    expect(result).toEqual([zed]);
  });
});
