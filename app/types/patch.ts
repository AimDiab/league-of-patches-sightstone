export type EntityType = "champion" | "item" | "system" | "other" | "cosmetic";

export type ChangeType =
  | "buff"
  | "nerf"
  | "adjustment"
  | "bug_fix"
  | "new"
  | "removed"
  | "cosmetic_release"
  | "chroma_release";

export interface PatchChange {
  entity_name: string;
  entity_type: EntityType;
  change_type: ChangeType;
  summary: string;
  champion?: string;
  price?: string | null;
}

export interface PatchData {
  patch_version: string;
  overall_summary: string;
  changes: PatchChange[];
}

export interface ChampionChanges {
  championName: string;
  changes: PatchChange[];
}
