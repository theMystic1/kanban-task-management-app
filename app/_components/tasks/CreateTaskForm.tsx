import Image from "next/image";
import Button from "../ui/Button";
import Input from "./Input";

import downArr from "@/public/assets/icon-chevron-down.svg";
import { useDarkMode } from "@/app/_contexts/DarkModeContext";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  addTaskToBoard,
  editTask,
  getBoardByname,
} from "@/app/services/supabase/actions";
import { useParams } from "next/navigation";
import SpinnerMini from "../ui/SpinnerMini";

type FormValues = {
  subtasks: string[];
  name: string;
  description: string;
};

type dataObj = {
  name: string;
  subtasks: string[];
  description: string;
};

type bordtype = {
  columns: string[];
  id: number;
};

type task = {
  name: string;
  status: string;
  description: string;
  taskId: string;
  subtasks: string[];
};

type paramerer = {
  close: () => void;
  type?: string;
  task?: task;
};

function CreateTaskForm({ close, type, task }: paramerer) {
  const { isDarkMode } = useDarkMode();

  // Initialize subtasks with either existing ones (if editing) or a single empty input for new tasks
  const [subtasks, setSubtasks] = React.useState<string[]>(
    type === "edit" && task ? task.subtasks : [""]
  );

  const [open, setOpen] = useState(false);
  const [boards, setBoards] = React.useState<bordtype>({
    columns: [],
    id: 0,
  });
  const params = useParams();

  const boardName =
    typeof params.board === "string" && decodeURIComponent(params.board);

  useEffect(() => {
    async function getBoard() {
      const board = await getBoardByname(boardName);
      setBoards(board);
    }
    getBoard();
  }, [boardName]);

  const { columns, id } = boards;
  const [col, setCol] = useState(columns[0]);

  const { register, handleSubmit, formState, setValue } = useForm<FormValues>();
  const { errors, isSubmitting } = formState;

  function handleAddSubtask(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setSubtasks([...subtasks, ""]);
  }

  function handleDeleteSubtask(
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) {
    e.preventDefault();
    setSubtasks(subtasks.filter((_, i) => i !== index));
  }

  function generateRandomId(length: number): string {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  async function onSubmit(data: dataObj) {
    const dataObj = {
      name: data.name.trim(),
      description: data.description.trim(),
      subtasks: subtasks.filter(Boolean), // Filter out any empty subtasks
      status: col ? col : columns[0],
      taskId: type === "new" ? generateRandomId(6) : task?.taskId ?? "",
    };

    if (type === "new") {
      await addTaskToBoard(id, dataObj);
    }

    if (type === "edit" && task) {
      await editTask(id, task.taskId, dataObj);
    }
    close();
  }

  const btnName = type === "edit" ? "Edit Task" : "Create Task";

  return (
    <form className="flex flex-col gap-4 w-full max-w-md  overflow-y-auto">
      <Input label="Title" labelFor="title" needBoarder={false}>
        <input
          type="text"
          placeholder="e.g take a coffee break"
          className={`w-full  text-lg px-4 py-2 border border-grayy-200 rounded-md ${
            isDarkMode ? "nav-dark-mode" : "nav-light-mode"
          }`}
          {...register("name", {
            required: "Can't be empty",
          })}
          defaultValue={type === "edit" && task ? task.name : ""}
        />
      </Input>
      <Input label="Description" labelFor="Description">
        <textarea
          rows={3}
          placeholder="e.g. I'll take a 5-minute break after my coffee."
          className={`w-full  text-lg px-4 py-2 border border-grayy-200 rounded-md ${
            isDarkMode ? "nav-dark-mode" : "nav-light-mode"
          }`}
          {...register("description", {
            required: "Can't be empty",
          })}
          defaultValue={type === "edit" && task ? task.description : ""}
        />
      </Input>
      {subtasks.map((subtask, i) => (
        <div className="grid grid-cols-[1fr,40px] gap-4 items-center" key={i}>
          <Input
            label=""
            labelFor={`subtasks.${i}`}
            error={errors?.subtasks?.[i]?.message}
          >
            <input
              type="text"
              placeholder="e.g drink coffee"
              className={`w-full text-lg px-4 py-2 border rounded-md ${
                isDarkMode ? "nav-dark-mode" : "nav-light-mode"
              } ${
                errors?.subtasks?.[i] ? "border-red-500" : "border-grayy-200"
              } outline-none`}
              {...register(`subtasks.${i}`, {
                required: "Can't be empty",
                onChange: (e) => {
                  const updatedSubtasks = [...subtasks];
                  updatedSubtasks[i] = e.target.value;
                  setSubtasks(updatedSubtasks);
                },
              })}
              defaultValue={subtask}
            />
          </Input>

          <button
            className="font-bold max-w-10 text-3xl text-grayy-200"
            onClick={(e) => handleDeleteSubtask(e, i)}
          >
            &times;
          </button>
        </div>
      ))}
      <Button type="secondary" onClick={handleAddSubtask}>
        + Add new subtasks
      </Button>
      <Input label="Status" labelFor="" needBoarder={true}>
        <div
          className="flex justify-between items-center h-full w-full px-3 relative cursor-pointer"
          onClick={() => setOpen((is) => !is)}
        >
          {type === "edit" && task ? (
            <p>{col ? col : task.status}</p>
          ) : (
            <p className="">{col ? col : columns[0]}</p>
          )}

          <div className="w-5 h-4 relative">
            <Image src={downArr} fill alt="Arrow down" />
          </div>
          {open ? (
            <div
              className={`absolute left-0 right-0 top-8 ${
                isDarkMode ? "nav-dark-mode" : "nav-light-mode"
              } flex flex-col gap-3 items-start p-3 z-50 rounded-lg shadow-2xl`}
            >
              {columns?.map((column, i) => (
                <button
                  key={i}
                  className="text-grayy-200 p-2 w-full text-start"
                  onClick={(e) => {
                    e.preventDefault();
                    setCol(column);
                    setOpen((is) => !is);
                  }}
                >
                  {column}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </Input>
      <Button type="primary" onClick={handleSubmit(onSubmit)}>
        {isSubmitting ? <SpinnerMini /> : btnName}
      </Button>
    </form>
  );
}

export default CreateTaskForm;
