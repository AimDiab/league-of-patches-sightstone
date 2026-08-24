import type { ChangeType } from "@/app/types/patch";
import { createArrayFilter } from "@/app/lib/filters/arrayFilter";

export const changeTypeFilter = createArrayFilter<ChangeType>("types");
export const championFilter = createArrayFilter<string>("champions");
