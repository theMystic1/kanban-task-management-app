"use client";

import sun from "@/public/assets/icon-light-theme.svg";
import moon from "@/public/assets/icon-dark-theme.svg";
import Image from "next/image";
import { useState } from "react";
import { useDarkMode } from "@/app/_contexts/DarkModeContext";

function ToggleDarkMode() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <div
      className={`w-full flex items-center gap-4  justify-center rounded-sm h-12 ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="relative w-4 h-4">
        <Image src={sun} fill alt="Color theme icon" />
      </div>
      <button
        className={`h-4 w-8 flex items-center rounded-xl bg-purpple-600 relative`}
        onClick={toggleDarkMode}
      >
        <div
          className={`h-[15px] absolute transition duration-500 ${
            isDarkMode ? "right-0" : "left-0"
          }  w-[15px] rounded-full bg-purpple-200`}
        ></div>
      </button>
      <div className="relative w-4 h-4">
        <Image src={moon} fill alt="Color theme icon" />
      </div>
    </div>
  );
}

export default ToggleDarkMode;
