"use client";

import { useAside } from "@/app/_contexts/AsideContext";
import eyeLogoClosed from "@/public/assets/icon-hide-sidebar.svg";

import eyeLogoOpen from "@/public/assets/icon-show-sidebar.svg";
import Image from "next/image";

function HideSideBar() {
  const { isClosed, handleClosed } = useAside();

  return (
    <button
      className={`  flex gap-4 items-center h-12  ${
        isClosed
          ? "w-20 rounded-r-full bottom-5 bg-purpple-600 absolute justify-center"
          : "items-center"
      } md:flex hidden`}
      onClick={handleClosed}
    >
      <div className="relative h-5 w-6">
        <Image
          src={isClosed ? eyeLogoOpen : eyeLogoClosed}
          fill
          alt="Eye icon"
        />
      </div>
      {isClosed ? null : <p className="text-grayy-200">Hide sidebar</p>}
    </button>
  );
}

export default HideSideBar;
