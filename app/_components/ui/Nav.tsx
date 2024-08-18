"use client";

import Image from "next/image";
import Button from "./Button";
import Logo from "./Logo";
import editIcon from "@/public/assets/hammer-outline.svg";
import trashIcon from "@/public/assets/trash-outline.svg";

import icon from "@/public/assets/icon-vertical-ellipsis.svg";

import crossIcon from "@/public/assets/icon-add-task-mobile.svg";

import downChev from "@/public/assets/icon-chevron-down.svg";

import upChev from "@/public/assets/icon-chevron-up.svg";

import { useParams, usePathname } from "next/navigation";
import { useDarkMode } from "@/app/_contexts/DarkModeContext";
import React, { useEffect } from "react";
import Modal from "./Modal";
import CreateTaskForm from "../tasks/CreateTaskForm";
import Delete from "../tasks/Delete";
import { getBoardByname } from "@/app/services/supabase/actions";
import CreateBoard from "../tasks/CreateNewBoard";
import SignOut from "../auth/SignOut";
import { NavModal } from "./LeftNav";

type task = {
  name: string;
  status: string;
  description: string;
  taskId: string;
  subtasks: string[];
};

export type bordtype = {
  columns: string[];
  id: number;
  name: string;
  tasks: task[];
};

type navProp = {
  onBoardDeleted: (id: number) => void;
  handleMobileNav: () => void;
  openMobileNav: boolean;
};

function Nav({ onBoardDeleted, handleMobileNav, openMobileNav }: navProp) {
  const pathname = usePathname();
  const param = useParams();
  const { isDarkMode } = useDarkMode();
  const [isOpenDeleteModal, setOpenDeleteModal] = React.useState(false);

  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenMenu, setOpenMenu] = React.useState(false);
  const [isOpenEditModal, setOpenEditModal] = React.useState(false);

  const [board, setBoard] = React.useState<bordtype>({
    columns: [],
    id: 0,
    name: "",
    tasks: [],
  });
  const openEditModal = () => setOpenEditModal(true);
  const closeEditModal = () => setOpenEditModal(false);

  const openDeleteModal = () => setOpenDeleteModal(true);
  const closeDeleteModal = () => setOpenDeleteModal(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const boardName = typeof param.board === "string" ? param.board : "";

  useEffect(() => {
    async function getBoard() {
      const board = await getBoardByname(decodeURIComponent(boardName));
      setBoard(board);
    }
    getBoard();
  }, [boardName]);

  return (
    <nav
      className={`flex items-center justify-between  h-24 px-8 ${
        isDarkMode ? "nav-dark-mode bg-grayy-700" : "nav-light-mode"
      }`}
    >
      <Modal isOpen={isOpen} onClose={closeModal} title="Create New Task">
        <CreateTaskForm type="new" close={closeModal} />
      </Modal>

      <Modal
        isOpen={isOpenDeleteModal}
        onClose={closeModal}
        title="Delete this board?"
      >
        <Delete
          type="board"
          name={boardName}
          close={closeDeleteModal}
          board={board}
          onBoardDeleted={onBoardDeleted}
        />
      </Modal>

      <Modal
        isOpen={isOpenEditModal}
        onClose={closeEditModal}
        title="Edit Board"
      >
        <CreateBoard type="edit" close={closeEditModal} board={board} />
      </Modal>
      <div className="flex gap-8 items-center">
        <div
          className={` ${
            isDarkMode ? "border-r-grayy-800" : "border-r-purpple-200 "
          } border-r-4 h-24 flex items-center pr-3`}
        >
          <span className="hidden md:flex">
            <Logo type={isDarkMode ? "logolight" : "logoDark"} />
          </span>
          <span className="md:hidden">
            <Logo type={"mobile"} />
          </span>
        </div>
        <button
          className="md:text-xl text-sm flex gap-2 items-center md:hidden capitalize font-bold"
          onClick={handleMobileNav}
        >
          {decodeURIComponent(boardName)}
          <span className="relative w-5 h-4">
            <Image
              src={openMobileNav ? upChev : downChev}
              fill
              alt="Open image"
            />
          </span>
        </button>

        <h1 className="text-xl md:flex hidden capitalize font-bold pl-8">
          {decodeURIComponent(boardName)}
        </h1>
      </div>

      {/* <SignOut /> */}

      <div className="flex items-center gap-4 relative">
        <span className="hidden md:flex">
          <Button
            type="primary"
            disabled={pathname === "/"}
            onClick={openModal}
          >
            + Add new task
          </Button>
        </span>

        <span className=" md:hidden">
          <Button
            type="primary"
            disabled={pathname === "/"}
            onClick={openModal}
          >
            <span className="relative w-5 h-5">
              <Image src={crossIcon} fill alt="Mobile Icon" />
            </span>
          </Button>
        </span>
        {isOpenMenu ? (
          <div
            className={`absolute ${
              isDarkMode ? "dark-mode" : "light-mode"
            } rounded-md w-28 flex flex-col gap-3 p-3 shadow-xl right-0 top-7 z-30`}
          >
            <button
              className="flex items-center gap-3"
              onClick={() => {
                openEditModal();
                setOpenMenu(false);
              }}
            >
              <span className="relative h-4 w-4">
                <Image src={editIcon} alt="Edit Icon" fill />
              </span>
              <span>Edit</span>
            </button>

            <button
              className="flex items-center gap-3"
              onClick={() => {
                openDeleteModal();
                setOpenMenu(false);
              }}
            >
              <span className="relative h-4 w-4">
                <Image src={trashIcon} alt="Delete icon" fill />
              </span>
              <span>Delete</span>
            </button>
          </div>
        ) : null}
        <button
          className="w-5 h-8 hover:bg-purpple-200 rounded-md transition-all duration-500 flex items-center justify-center "
          onClick={() => setOpenMenu((is) => !is)}
        >
          <span className="w-1 h-5 relative">
            <Image src={icon} fill alt="Icon" />
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Nav;
