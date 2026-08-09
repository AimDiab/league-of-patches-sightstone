import type { PatchDataSource } from "@/app/data/patchDataSource";
import { MockPatchDataSource } from "@/app/data/mockPatchDataSource";

export type { PatchDataSource } from "@/app/data/patchDataSource";
export const patchDataSource: PatchDataSource = new MockPatchDataSource();
