"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {
  // Popup
  isPopupOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;

  // Side Navigation
  isSideNavOpen: boolean;
  openSideNav: () => void;
  closeSideNav: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openSideNav = () => {
    setIsSideNavOpen(true);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        isPopupOpen,
        openPopup,
        closePopup,

        isSideNavOpen,
        openSideNav,
        closeSideNav,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}