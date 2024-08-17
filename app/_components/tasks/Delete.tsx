import { deleteBoard, deleteTask } from "@/app/services/supabase/actions";
import Button from "../ui/Button";
import React, { startTransition } from "react";
import SpinnerMini from "../ui/SpinnerMini";
import { useOptimistic } from "react";
import { useRouter } from "next/navigation";

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

type deleteProps = {
  name: string;
  type: string;
  close: () => void;
  board: bordtype;
  id?: string;
  onBoardDeleted?: (deletedBoardId: number) => void; // Add this prop
};

function Delete({ name, type, close, board, id, onBoardDeleted }: deleteProps) {
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  // Use useOptimistic hook with explicit type for tasks
  const [optimisticBoard, setOptimisticBoard] = useOptimistic(
    board,
    (currentBoard: bordtype, updatedTasks: task[]) => ({
      ...currentBoard,
      tasks: updatedTasks,
    })
  );

  async function handledelete() {
    setPending(true);

    if (type === "task" && id) {
      const updatedTasks = optimisticBoard.tasks.filter(
        (task) => task.taskId !== id
      );

      // Use startTransition to wrap the optimistic update
      startTransition(() => {
        setOptimisticBoard(updatedTasks);
      });

      try {
        // Perform the actual deletion
        await deleteTask(board.id, id);
      } catch (error) {
        console.error(error);

        // Optionally: Revert optimistic update if deletion fails
        startTransition(() => {
          setOptimisticBoard(board.tasks);
        });
      } finally {
        setPending(false);
        close();
      }
    } else if (type === "board") {
      try {
        await deleteBoard(board.id);

        if (onBoardDeleted) {
          onBoardDeleted(board.id);
        }
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setPending(false);
        close();
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-grayy-200 text-sm">
        Are you sure you want to delete {decodeURIComponent(name)} {type}?
      </p>

      <div className="grid grid-cols-2 items-center gap-4">
        <Button type="danger" onClick={handledelete}>
          {pending ? <SpinnerMini /> : "Delete"}
        </Button>
        <Button type="secondary" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default Delete;
