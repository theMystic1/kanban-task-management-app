"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CreateTaskForm from "../tasks/CreateTaskForm";
import { useParams, usePathname } from "next/navigation";
import { getBoardByname } from "@/app/services/supabase/actions";
import { useDarkMode } from "@/app/_contexts/DarkModeContext";
import { useAside } from "@/app/_contexts/AsideContext";
import Spinner from "../ui/Spinner";
import CurrentTaskItem from "../tasks/CurrentTaskItem";

type task = {
  name: string;
  status: string;
  description: string;
  taskId: string;
  subtasks: string[];
};

type bordtype = {
  columns: string[];
  id: number;
  name: string;
  tasks: task[];
};

function Home({}) {
  const [isOpen, setIsOpen] = useState(false);
  const [fetch, setFetch] = useState(false);

  const [boards, setBoards] = useState<bordtype>({
    columns: [],
    id: 0,
    name: "",
    tasks: [],
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { board } = useParams();

  const { isClosed } = useAside();

  const boardName = typeof board === "string" && decodeURIComponent(board);

  useEffect(() => {
    async function getBoard() {
      setFetch(true);
      try {
        const data = await getBoardByname(boardName);

        setBoards(data);
      } catch (error) {
        console.error(error);
      } finally {
        setFetch(false);
      }
    }

    getBoard();
  }, [boardName]);

  const firstCol = boards?.tasks.filter(
    (task) => task.status === boards.columns[0]
  );

  const secondCol = boards?.tasks.filter(
    (task) => task.status === boards.columns[1]
  );

  const thirdCol = boards?.tasks.filter(
    (task) => task.status === boards.columns[2]
  );

  if (fetch)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <div
      className={`h-full relative w-full flex ${
        boards?.tasks.length > 0 ? "" : "justify-center items-center"
      } flex-col gap-4 overflow-x-auto ${
        isClosed ? "md:pl-20" : "md:pl-60"
      } transition-all duration-700 py-6`}
    >
      {boards?.tasks.length > 0 ? (
        <GridBox>
          {boards.columns[0] && (
            <GridRow>
              <Column col={boards?.columns[0]} i={1 + 0} />
              {firstCol &&
                firstCol.map((task, i) => (
                  <TaskItem key={task.taskId} task={task} board={boards} />
                ))}
            </GridRow>
          )}

          {boards.columns[1] && (
            <GridRow>
              <Column col={boards?.columns[1]} i={1 + 1} />
              {secondCol &&
                secondCol.map((task, i) => (
                  <TaskItem key={task.taskId} task={task} board={boards} />
                ))}
            </GridRow>
          )}
          {boards.columns[2] && (
            <GridRow>
              <Column col={boards?.columns[2]} i={1 + 2} />

              {thirdCol &&
                thirdCol.map((task, i) => (
                  <TaskItem key={task.taskId} task={task} board={boards} />
                ))}
            </GridRow>
          )}
          <GridRow>
            <div className="w-full h-screen flex items-center flex-col justify-center">
              <EmptyBoard
                isOpen={isOpen}
                closeModal={closeModal}
                openModal={openModal}
              />
            </div>
          </GridRow>
        </GridBox>
      ) : (
        <EmptyBoard
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

type emptyBoard = {
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
};

type gridProp = {
  children: React.ReactNode;
};

type colu = {
  col: string;
  i: number;
};

function EmptyBoard({ isOpen, closeModal, openModal }: emptyBoard) {
  const pathname = usePathname();
  return (
    <>
      <p className="text-grayy-200 text-center">
        This board is empty. Create a new Column to get started.
      </p>
      <Modal isOpen={isOpen} onClose={closeModal} title="Add New Tasks">
        <CreateTaskForm close={closeModal} type="new" />
      </Modal>
      <Button type="primary" disabled={pathname === "/"} onClick={openModal}>
        + Add new Task
      </Button>
    </>
  );
}

function GridRow({ children }: gridProp) {
  return (
    <div className="w-full h-full flex flex-col gap-5 mb-5">{children}</div>
  );
}

function Column({ col, i }: colu) {
  return (
    <div className="flex items-center gap-3  w-md:[400px] w-[360px]">
      <div
        className={`${
          i === 1 ? "bg-circle-1" : i === 2 ? "bg-circle-2" : "bg-circle-3"
        }  h-5 w-5 rounded-full`}
      ></div>

      <h2 className="text-grayy-200 text-xl tracking-widest uppercase">
        {col}
      </h2>
    </div>
  );
}

function TaskItem({ task, board }: { task: task; board: bordtype }) {
  const { isDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div
      className={`${
        isDarkMode ? "nav-dark-mode" : "nav-light-mode"
      }  min-h-24 shadow-xl flex flex-col justify-center gap-2 px-4 rounded-lg w-[340px] md:w-[400px] xl:w-full cursor-pointer`}
      onClick={openModal}
    >
      <Modal onClose={closeModal} isOpen={isOpen} title="">
        <CurrentTaskItem task={task} board={board} close={closeModal} />
      </Modal>
      <h1 className="text-xl font-semibold">{task.name}</h1>

      <p className="text-grayy-200 ">{task?.subtasks.length} subtasks</p>
    </div>
  );
}

function GridBox({ children }: gridProp) {
  return (
    <div className="w-full grid grid-cols-[340px,340px,340px,340px] md:grid-cols-[400px,400px,400px,400px] xl:grid-cols-4 gap-4 p-6">
      {children}
    </div>
  );
}

export default Home;
