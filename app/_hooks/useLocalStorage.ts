import { useState, useEffect } from "react";

export function useLocalStorageState<T>(initialState: T, key: string) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      // If running on the server, return the initial state
      return initialState;
    } else {
      // If running in the browser, retrieve from localStorage
      const storedValue = localStorage.getItem(key);
      return storedValue ? (JSON.parse(storedValue) as T) : initialState;
    }
  });

  useEffect(() => {
    // Prevent code from running during SSR
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key]);

  return [value, setValue] as const;
}
