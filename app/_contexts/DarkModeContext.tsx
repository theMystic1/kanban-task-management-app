"use client";

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { useLocalStorageState } from "../_hooks/useLocalStorage";

type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(false, "isDarkMode");

  function toggleDarkMode() {
    setIsDarkMode((prevIsDark: boolean) => !prevIsDark);
  }

  const value = { isDarkMode, toggleDarkMode };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error(
      "useDarkMode must be used within a DarkModeProvider component"
    );
  }
  return context;
}

export { DarkModeProvider, useDarkMode };
