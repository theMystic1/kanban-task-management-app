import Image from "next/image";
import Button from "../ui/Button";
import Input from "./Input";
import { useDarkMode } from "@/app/_contexts/DarkModeContext";
import React from "react";
import { useForm } from "react-hook-form";
import SpinnerMini from "../ui/SpinnerMini";
import { createBoard, updateBoard } from "@/app/services/supabase/actions";
import { usePathname } from "next/navigation";
import { bordtype } from "../ui/Nav";

type FormValues = {
  columns: string[];
  name: string;
};

export type dataObj = {
  name: string;
  columns: string[];
};

type CreateBoardProps = {
  close: () => void;
  type: string;
  onBoardCreated?: (updatedBoard: bordtype) => void;
};

type bordprp = {
  close: () => void;
  type: string;
  board?: bordtype;
  onBoardCreated?: (updatedBoard: bordtype) => void;
};

function CreateBoard({ close, type, board, onBoardCreated }: bordprp) {
  const { isDarkMode } = useDarkMode();
  const [columns, setColumns] = React.useState<string[]>(
    type === "edit" && board ? board.columns : [""]
  );

  const pathname = usePathname();
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      name: board?.name || "",
      columns: board?.columns || [""],
    },
  });

  const { errors, isSubmitting } = formState;

  function handleAddColumns(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setColumns([...columns, ""]);
  }

  function handleDeleteColumn(
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) {
    e.preventDefault();
    setColumns(columns.filter((_, i) => i !== index));
  }

  async function onSubmit(data: dataObj) {
    if (type === "new") {
      const createdBoard = await createBoard(
        { ...data, ownerId: "", tasks: [] },
        pathname
      );
      if (onBoardCreated && createdBoard) {
        onBoardCreated(createdBoard[0]);
      }
    } else if (type === "edit" && board?.id) {
      const updatedBoard = await updateBoard(data, board.id);
      if (onBoardCreated && updatedBoard) {
        onBoardCreated(updatedBoard);
      }
    }
    close();
  }

  const btnName = type === "edit" ? "Edit Board" : "Create new Board";

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Name"
        labelFor="board name"
        needBoarder={false}
        error={errors?.name?.message}
      >
        <input
          type="text"
          placeholder="e.g take a coffee break"
          className={`w-full text-lg px-4 py-2 border border-grayy-200 rounded-md ${
            isDarkMode ? "nav-dark-mode" : "nav-light-mode"
          } ${
            errors?.name ? "border-red-500" : "border-grayy-200"
          } outline-none`}
          {...register("name", {
            required: "Can't be empty",
          })}
        />
      </Input>

      <label className="text-grayy-200">Columns</label>
      {columns.map((column, i) => (
        <div className="grid grid-cols-[1fr,40px] gap-4 items-center" key={i}>
          <Input
            label=""
            labelFor="column"
            error={errors?.columns?.[i]?.message}
          >
            <input
              type="text"
              placeholder="e.g drink coffee"
              className={`w-full text-lg px-4 py-2 border rounded-md ${
                isDarkMode ? "nav-dark-mode" : "nav-light-mode"
              } ${
                errors?.columns?.[i] ? "border-red-500" : "border-grayy-200"
              } outline-none`}
              defaultValue={column}
              {...register(`columns.${i}`, {
                required: "Enter a Column Name",
              })}
            />
          </Input>

          <button
            className="font-bold max-w-10 text-3xl text-grayy-200"
            onClick={(e) => handleDeleteColumn(e, i)}
          >
            &times;
          </button>
        </div>
      ))}

      {columns.length < 3 ? (
        <Button type="secondary" onClick={handleAddColumns}>
          + Add new column
        </Button>
      ) : null}

      <Button type="primary" disabled={isSubmitting}>
        {isSubmitting ? <SpinnerMini /> : btnName}
      </Button>
    </form>
  );
}

export default CreateBoard;
