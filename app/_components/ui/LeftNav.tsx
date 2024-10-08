"use client";

import React, { useEffect } from "react";
import Logo from "./Logo";
import Link from "next/link";
import boardLogo from "@/public/assets/icon-board.svg";
import boardAdd from "@/public/assets/icon-board -add.svg";
import boardLogoActive from "@/public/assets/icon-board-active.svg";
import Image from "next/image";
import { useParams } from "next/navigation";
import ToggleDarkMode from "./ToggleDarkMode";
import HideSideBar from "./HideSideBar";
import { useAside } from "@/app/_contexts/AsideContext";
import { useDarkMode } from "@/app/_contexts/DarkModeContext";
import Modal from "./Modal";
import CreateBoard from "../tasks/CreateNewBoard";
import { getBoards } from "@/app/services/supabase/actions";
import SpinnerMini from "./SpinnerMini";

export type Board = {
  id: number;
  name: string;
  tasks: object[]; // Define this according to your tasks structure
  // Add other fields as necessary
};
// Define the type for the list of boards
type LeftNavProps = {
  board: Board[];
  loading: boolean;
  onBoardCreated: (newBoard: Board) => void; // Add this prop type
  userId?: string;
  openMobileNav?: boolean;
  handleMobileNav?: () => void;
};

function LeftNavItem({
  board,
  loading,
  onBoardCreated,
  userId,
  openMobileNav,
}: LeftNavProps) {
  const { isClosed } = useAside();
  const params = useParams();
  const { isDarkMode } = useDarkMode();
  const [showModal, setShowModal] = React.useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Function to handle when a new board is created

  return (
    <aside
      className={`absolute left-0 top-0 ${
        isDarkMode ? "nav-dark-mode bg-grayy-700" : "nav-light-mode"
      } flex flex-col justify-between pr-4 shadow-xl w-56 min-h-screen pt-10 pb-12 transition-all duration-700 ${
        isClosed ? "-translate-x-[1000px]" : "translate-x-0"
      } z-50 hidden md:flex`}
    >
      <Modal isOpen={showModal} title="Add New Board" onClose={closeModal}>
        <CreateBoard
          close={closeModal}
          type="new"
          onBoardCreated={onBoardCreated}
          userId={userId}
        />
      </Modal>
      <div>
        <Logo
          type={isDarkMode ? "logolight" : "logoDark"}
          className="mx-4 mb-8"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-grayy-200 p-4">All Boards ({board?.length})</h1>

          {loading ? (
            <div className="h-full w-full items-center flex justify-center">
              <SpinnerMini />
            </div>
          ) : (
            board.map((bor: Board, index: number) => (
              <Boards
                key={bor.id}
                board={bor}
                active={
                  typeof params.board === "string" &&
                  bor.name.toLowerCase() ===
                    decodeURIComponent(params.board).toLowerCase()
                }
              />
            ))
          )}
          <button
            className="text-purpple-600 flex items-center gap-2 font-semibold pl-4"
            onClick={openModal}
          >
            <span className="relative h-5 w-5">
              <Image src={boardAdd} fill alt="Add board icon" />
            </span>
            <span>+Create New Board</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-8 px-4 ">
        <ToggleDarkMode />
        <HideSideBar />
      </div>
    </aside>
  );
}

type BoardsProps = {
  board: Board;
  active?: boolean;
  onClick?: () => void;
};

function Boards({ board, active, onClick }: BoardsProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <Link
      href={`/boards/${board.name}`}
      className={`${
        active
          ? "bg-purpple-600 text-purpple-100"
          : "text-grayy-200 hover:bg-purpple-200"
      } ${
        isDarkMode
          ? "text-grayy-200 hover:bg-grayy-500 "
          : "hover:bg-grayy-500 hover:text-grayy-300"
      } flex gap-2 py-3 pl-4 rounded-r-full items-center`}
      onClick={onClick}
    >
      <span className="relative h-5 w-5">
        <Image
          src={active ? boardLogoActive : boardLogo}
          fill
          alt="board icon"
        />
      </span>
      <span className="font-semibold capitalize">{board.name}</span>
    </Link>
  );
}

export function NavModal({
  board,
  loading,
  onBoardCreated,
  userId,
  handleMobileNav,
}: LeftNavProps) {
  const [showModal, setShowModal] = React.useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const { isDarkMode } = useDarkMode();

  const params = useParams();

  return (
    <div
      className={`flex flex-col gap-4 absolute md:hidden rounded-md shadow-2xl w-[350px] left-4 top-28 pr-4 z-50  ${
        isDarkMode ? "nav-dark-mode" : "nav-light-mode"
      } py-6`}
    >
      <Modal isOpen={showModal} title="Add New Board" onClose={closeModal}>
        <CreateBoard
          close={closeModal}
          type="new"
          onBoardCreated={onBoardCreated}
          userId={userId}
        />
      </Modal>
      <h1 className="text-grayy-200 p-4">All Boards ({board?.length})</h1>

      {loading ? (
        <div className="h-full w-full items-center flex justify-center">
          <SpinnerMini />
        </div>
      ) : (
        board.map((bor: Board, index: number) => (
          <Boards
            key={bor.id}
            board={bor}
            active={
              typeof params.board === "string" &&
              bor.name.toLowerCase() ===
                decodeURIComponent(params.board).toLowerCase()
            }
            onClick={handleMobileNav}
          />
        ))
      )}
      <button
        className="text-purpple-600 flex items-center gap-2 font-semibold pl-4"
        onClick={openModal}
      >
        <span className="relative h-5 w-5">
          <Image src={boardAdd} fill alt="Add board icon" />
        </span>
        <span>+Create New Board</span>
      </button>
      <div className="flex items-center justify-center w-full px-4">
        <ToggleDarkMode />
      </div>
    </div>
  );
}

export default LeftNavItem;
