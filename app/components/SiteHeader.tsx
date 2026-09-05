import ThemeToggle from "@/app/components/ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="border-b border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 sm:px-10">
        <span className="text-sm font-semibold tracking-tight text-black dark:text-zinc-50">
          League of Patches
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
