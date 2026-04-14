"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "white" | "black";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const THEME_STORAGE_KEY = "discovery-theme";
const THEME_CHANGE_EVENT = "discovery-theme-change";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "white";
  }

  const domTheme = document.documentElement.dataset.theme;
  if (domTheme === "white" || domTheme === "black") {
    return domTheme;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "white" || storedTheme === "black") {
      return storedTheme;
    }
  } catch {
    // Ignore storage failures and keep the default light theme.
  }

  return "white";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "black" ? "dark" : "light";
}

function syncTheme(theme: ThemeMode) {
  applyTheme(theme);

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures and keep the in-memory theme active.
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY) {
      callback();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribe,
    readStoredTheme,
    () => "white",
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: syncTheme,
      toggleTheme: () =>
        syncTheme(theme === "white" ? "black" : "white"),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemePreference must be used within ThemeProvider.");
  }

  return context;
}
