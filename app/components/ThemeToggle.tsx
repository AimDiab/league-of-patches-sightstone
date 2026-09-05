"use client";

import { useCallback, useSyncExternalStore } from "react";

const THEME_STORAGE_KEY = "theme";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

type Theme = "light" | "dark";

// In-memory notification so the component re-renders after a local toggle.
const listeners = new Set<() => void>();
function emitChange() {
  for (const listener of listeners) listener();
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage unavailable (e.g. blocked).
  }
  return null;
}

/**
 * Reads the current theme from the same source as the pre-paint script in
 * app/layout.tsx: an explicit localStorage choice wins over the system
 * preference.
 */
function getSnapshot(): Theme {
  const stored = readStoredTheme();
  if (stored) return stored;
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

/** Mirrors a theme change onto <html> so the page never desyncs from the toggle. */
function applyThemeToDocument(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // Toggles made in other tabs/windows arrive as a "storage" event; apply the
  // class here too, then let React re-render from the new snapshot.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyThemeToDocument(getSnapshot());
    onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  // Live OS preference changes only matter when no explicit choice is stored.
  const media = window.matchMedia(DARK_MEDIA_QUERY);
  const onSystemPreferenceChange = () => {
    if (readStoredTheme() !== null) return;
    applyThemeToDocument(media.matches ? "dark" : "light");
    onStoreChange();
  };
  media.addEventListener("change", onSystemPreferenceChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystemPreferenceChange);
  };
}

function getServerSnapshot(): Theme {
  return "light";
}

export default function ThemeToggle() {
  // useSyncExternalStore renders the server snapshot during SSR *and* hydration,
  // then switches to the real client value after mount — no hydration mismatch.
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Apply immediately so a local click never lags the button state by a frame.
    applyThemeToDocument(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignore persistence failures; the class toggle above still applies.
    }
    emitChange();
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/[.08] bg-white text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
