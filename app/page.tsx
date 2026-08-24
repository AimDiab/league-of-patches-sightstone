import { Suspense } from "react";
import { patchDataSource } from "@/app/data";
import type { ChampionChanges } from "@/app/types/patch";
import ChampionChangeCard from "@/app/components/ChampionChangeCard";
import Dashboard from "@/app/components/Dashboard";

// TODO: replace with dynamic patch selection once more than one mock patch exists.
const CURRENT_PATCH_VERSION = "26.14";

// Rendered while the Dashboard's useSearchParams client boundary resolves, so the
// unfiltered grid still shows up in the initial static HTML.
function DashboardFallback({ championChanges }: { championChanges: ChampionChanges[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {championChanges.map((cc) => (
        <ChampionChangeCard key={cc.championName} championChanges={cc} />
      ))}
    </div>
  );
}

export default async function Home() {
  const championChanges = await patchDataSource.getChampionChanges(CURRENT_PATCH_VERSION);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-12 sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Patch {CURRENT_PATCH_VERSION} Champion Changes
        </h1>
        <Suspense fallback={<DashboardFallback championChanges={championChanges} />}>
          <Dashboard championChanges={championChanges} />
        </Suspense>
      </main>
    </div>
  );
}
