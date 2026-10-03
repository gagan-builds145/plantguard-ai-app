import { useEffect, useState } from "react";

/**
 * State that survives a refresh — used by the role prototypes for things the
 * user creates locally (plants, vehicles, saved posts, accepted jobs). Values
 * are stored under a PlantGuard-namespaced key.
 */
export function useLocalState<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const fallback =
      typeof initial === "function" ? (initial as () => T)() : initial;
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(`plantguard:${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(`plantguard:${key}`, JSON.stringify(value));
    } catch {
      // Storage can be unavailable (private mode) — state still works in memory.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
