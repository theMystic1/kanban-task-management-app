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
};

function LeftNav({ board, loading }: LeftNavProps) {
  const { isClosed } = useAside();
  const params = useParams();
  const { isDarkMode } = useDarkMode();
  const [showModal, setShowModal] = React.useState(false);
  const [boards, setBoards] = React.useState<Board[]>([]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Function to handle when a new board is created
  const handleBoardCreated = (newBoard: Board) => {
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };

  useEffect(() => {
    async function fetchBoards() {
      try {
        const boardData = await getBoards();
        setBoards(boardData);
      } catch (error: unknown) {
        console.error(error);
      }
    }

    fetchBoards();
  }, []);

  return (
    <aside
      className={`absolute left-0 top-0 ${
        isDarkMode ? "nav-dark-mode bg-grayy-700" : "nav-light-mode"
      } flex flex-col justify-between pr-4 shadow-xl w-56 min-h-screen pt-10 pb-12 transition-all duration-700 ${
        isClosed ? "-translate-x-[1000px]" : "translate-x-0"
      } z-50`}
    >
      <Modal isOpen={showModal} title="Add New Board" onClose={closeModal}>
        <CreateBoard
          close={closeModal}
          type="new"
          onBoardCreated={handleBoardCreated}
        />
      </Modal>
      <div>
        <Logo
          type={isDarkMode ? "logolight" : "logoDark"}
          className="mx-4 mb-8"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-grayy-200 p-4">All Boards ({boards?.length})</h1>

          {loading ? (
            <div className="h-full w-full items-center flex justify-center">
              <SpinnerMini />
            </div>
          ) : (
            boards.map((bor: Board, index: number) => (
              <Boards
                key={bor.id}
                board={bor}
                active={
                  typeof params.boards === "string" &&
                  bor.name.toLowerCase() ===
                    decodeURIComponent(params.boards).toLowerCase()
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
};

function Boards({ board, active }: BoardsProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <Link
      href={`/${board.name}`}
      className={`${
        active
          ? "bg-purpple-600 text-purpple-100"
          : "text-grayy-200 hover:bg-purpple-200"
      } ${
        isDarkMode
          ? "text-grayy-200 hover:bg-grayy-500 "
          : "hover:bg-grayy-500 hover:text-grayy-300"
      } flex gap-2 py-3 pl-4 rounded-r-full items-center`}
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

export default LeftNav;
