import type { ChangeType } from "@/app/types/patch";

export const CHANGE_TYPES: ChangeType[] = [
  "buff",
  "nerf",
  "adjustment",
  "bug_fix",
  "new",
  "removed",
  "cosmetic_release",
  "chroma_release",
];

export const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  buff: "Buff",
  nerf: "Nerf",
  adjustment: "Adjustment",
  bug_fix: "Bug Fix",
  new: "New",
  removed: "Removed",
  cosmetic_release: "Cosmetic Release",
  chroma_release: "Chroma Release",
};
