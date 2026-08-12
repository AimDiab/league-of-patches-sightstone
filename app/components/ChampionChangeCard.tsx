import type { ChampionChanges, ChangeType } from "@/app/types/patch";

export interface ChampionChangeCardProps {
  championChanges: ChampionChanges;
}

const CHANGE_TYPE_BADGE_STYLES: Record<ChangeType, string> = {
  buff: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  nerf: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  adjustment: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  bug_fix: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  new: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  removed: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  cosmetic_release: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  chroma_release: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  buff: "Buff",
  nerf: "Nerf",
  adjustment: "Adjustment",
  bug_fix: "Bug Fix",
  new: "New",
  removed: "Removed",
  cosmetic_release: "Cosmetic Release",
  chroma_release: "Chroma Release",
};

export default function ChampionChangeCard({ championChanges }: ChampionChangeCardProps) {
  const { championName, changes } = championChanges;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-black/[.08] bg-white p-5 dark:border-white/[.145] dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">{championName}</h2>
      <ul className="flex flex-col gap-2">
        {changes.map((change, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-0.5 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${CHANGE_TYPE_BADGE_STYLES[change.change_type]}`}
            >
              {CHANGE_TYPE_LABELS[change.change_type]}
            </span>
            <span className="text-zinc-700 dark:text-zinc-300">{change.summary}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
