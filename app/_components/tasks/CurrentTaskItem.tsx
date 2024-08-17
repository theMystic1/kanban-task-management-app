import Image from "next/image";
import { useState } from "react";
import cjrvron from "@/public/assets/icon-vertical-ellipsis.svg";
import checkIcon from "@/public/assets/icon-check.svg";
import editIcon from "@/public/assets/hammer-outline.svg";
import trashIcon from "@/public/assets/trash-outline.svg";
import { useDarkMode } from "@/app/_contexts/DarkModeContext";
import Input from "./Input";
import Modal from "../ui/Modal";
import CreateTaskForm from "./CreateTaskForm";
import Delete from "./Delete";

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

function CurrentTaskItem({
  task,
  board,
  close,
}: {
  task: task;
  board: bordtype;
  close: () => void;
}) {
  const { isDarkMode } = useDarkMode();

  const [isOpen, setOpen] = useState(false);

  const [isOpenModal, setOpenModal] = useState(false);
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);

  const [isOpenMenu, setOpenMenu] = useState(false);

  const openModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  const openDeleteModal = () => setOpenDeleteModal(true);
  const closeDeleteModal = () => setOpenDeleteModal(false);

  function handleOpenModal(opens: string) {
    openModal();
    setOpenMenu(false);
  }

  return (
    <div className="">
      <div className="flex items-center justify-between relative">
        <h1 className="mb-4 font-semibold">{task?.name}</h1>

        {
          <Modal isOpen={isOpenModal} onClose={closeModal} title="Edit Task">
            <CreateTaskForm type="edit" close={closeModal} task={task} />
          </Modal>
        }

        {
          <Modal
            isOpen={isOpenDeleteModal}
            onClose={closeDeleteModal}
            title={`  Delete this task`}
          >
            <Delete
              name={task?.name}
              type="task"
              close={closeDeleteModal}
              board={board}
              id={task.taskId}
            />
          </Modal>
        }

        {isOpenMenu ? (
          <div
            className={`absolute ${
              isDarkMode ? "dark-mode" : "light-mode"
            } rounded-md w-28 flex flex-col gap-3 p-3 shadow-xl right-0 top-7 z-30`}
          >
            <button
              className="flex items-center gap-3"
              onClick={() => {
                handleOpenModal("edit");
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
          className="w-1 h-5 relative"
          onClick={() => setOpenMenu((is) => !is)}
        >
          <Image src={cjrvron} fill alt="Menu icon" />
        </button>
      </div>
      <p className="text-grayy-200 text-sm mb-5">{task?.description}</p>
      <div>
        <p className="text-grayy-200 text-sm mb-5">
          Subtasks ( {task?.subtasks.length})
        </p>

        {task?.subtasks.map((subtask, i) => (
          <SubTasksContainer subtask={subtask} status={task?.status} key={i} />
        ))}
      </div>
      <Input label="Current Status" labelFor="" needBoarder={true}>
        <div
          className="flex justify-between items-center h-full w-full px-3 relative cursor-pointer"
          onClick={() => setOpen((is) => !is)}
        >
          <p>{task?.status}</p>
          {isOpen ? (
            <div
              className={`absolute  left-0 right-0  top-8 ${
                isDarkMode ? "nav-dark-mode" : "nav-light-mode"
              } flex flex-col gap-3 items-start p-3 z-50 rounded-lg shadow-2xl`}
            >
              {board?.columns.map((bd, i) => (
                <button
                  className="text-grayy-200 p-2 w-full text-start"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  key={i}
                >
                  {bd}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </Input>
    </div>
  );
}

type subType = {
  subtask: string;
  status: string;
};

function SubTasksContainer({ subtask, status }: subType) {
  return (
    <div
      className={`w-full py-2 px-3 flex items-center gap-4 ${
        status === "Done" ? "" : ""
      } mb-3 bg-purpple-200 rounded-sm`}
    >
      <button
        className={`w-6 h-6 flex items-center justify-center ${
          status === "Done" ? "bg-purpple-600" : "bg-white-0"
        } rounded-sm`}
        onClick={() => {}}
      >
        {status === "Done" ? (
          <span className="relative h-3 w-4">
            <Image src={checkIcon} alt="Check Icon" fill />
          </span>
        ) : null}
      </button>

      <p
        className={`text-sm ${
          status === "Done" ? "text-grayy-200" : "text-grayy-700"
        }`}
      >
        {subtask}
      </p>
    </div>
  );
}

export default CurrentTaskItem;
