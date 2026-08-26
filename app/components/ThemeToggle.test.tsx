import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";

/** jsdom does not implement matchMedia; mock the system preference. */
let systemPrefersDark = false;
const mediaChangeListeners = new Set<() => void>();

function mockSystemPrefersDark(prefersDark: boolean) {
  systemPrefersDark = prefersDark;
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    get matches() {
      return query === "(prefers-color-scheme: dark)" && systemPrefersDark;
    },
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: (event: string, listener: () => void) => {
      if (event === "change") mediaChangeListeners.add(listener);
    },
    removeEventListener: (event: string, listener: () => void) => {
      if (event === "change") mediaChangeListeners.delete(listener);
    },
    dispatchEvent: jest.fn(),
  }));
}

function emitSystemPreferenceChange() {
  for (const listener of [...mediaChangeListeners]) listener();
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    mediaChangeListeners.clear();
    mockSystemPrefersDark(false);
  });

  it("starts in light mode when no preference is stored and the system prefers light", () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" })
    ).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("starts in dark mode when the system prefers dark and no preference is stored", () => {
    mockSystemPrefersDark(true);

    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();
  });

  it("respects a stored preference over the system setting", () => {
    localStorage.setItem("theme", "dark");

    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();
  });

  it("follows live OS preference changes when no explicit choice is stored", () => {
    render(<ThemeToggle />);

    mockSystemPrefersDark(true);
    act(() => emitSystemPreferenceChange());

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();
  });

  it("applies the theme from other tabs via storage events", () => {
    render(<ThemeToggle />);

    localStorage.setItem("theme", "dark");
    fireEvent(window, new StorageEvent("storage", { key: "theme" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();
  });

  it("toggles the dark class on <html> and persists the choice when clicked", () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Switch to light mode" })
    );

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
