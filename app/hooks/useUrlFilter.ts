"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FilterDefinition } from "@/app/lib/filters/types";

export function useUrlFilter<T>(definition: FilterDefinition<T>): [T, (value: T) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = definition.parse(searchParams.get(definition.key));

  const setValue = useCallback(
    (next: T) => {
      const params = new URLSearchParams(searchParams.toString());
      const serialized = definition.serialize(next);
      if (serialized === null) {
        params.delete(definition.key);
      } else {
        params.set(definition.key, serialized);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [definition, pathname, router, searchParams]
  );

  return [value, setValue];
}
