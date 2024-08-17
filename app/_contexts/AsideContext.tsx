"use client";

import { createContext, useState, useContext, ReactNode } from "react";

type prop = {
  children: ReactNode;
};

type ContextType = {
  isClosed: boolean;
  handleClosed: () => void;
  setIsClosed: (isClosed: boolean) => void;
};

// Create the context with a default value of `undefined`
const AsideContext = createContext<ContextType | undefined>(undefined);

function AsideContextProvider({ children }: prop) {
  const [isClosed, setIsClosed] = useState(false);

  function handleClosed() {
    setIsClosed((is) => !is);
  }
  return (
    <AsideContext.Provider value={{ isClosed, handleClosed, setIsClosed }}>
      {children}
    </AsideContext.Provider>
  );
}

function useAside() {
  const context = useContext(AsideContext);

  if (context === undefined)
    throw new Error("Context was used outside of Aside context provider");

  return context;
}
export { AsideContextProvider, useAside };
