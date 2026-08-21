import type { FilterDefinition } from "@/app/lib/filters/types";

export function createArrayFilter<T extends string>(key: string): FilterDefinition<T[]> {
  return {
    key,
    defaultValue: [],
    parse: (raw) => (raw ? (raw.split(",").filter(Boolean).map(decodeURIComponent) as T[]) : []),
    serialize: (value) => (value.length > 0 ? value.map(encodeURIComponent).join(",") : null),
  };
}
