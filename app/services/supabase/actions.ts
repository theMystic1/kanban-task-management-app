"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { dataObj } from "@/app/_components/tasks/CreateNewBoard";
import { redirect } from "next/navigation";

export async function createBoard(board: object, param: string) {
  const { data, error } = await supabase
    .from("boards")
    .insert([board])
    .select();

  if (error) {
    console.error(error.message);
    throw new Error(`Error creating board: ${error.message}`);
  }

  console.log(param);
  revalidatePath(param);
  revalidatePath("/");
  // redirect(`/${data}`);

  return data;
}

export async function updateBoard(board: dataObj, boardId: number | undefined) {
  const { data, error } = await supabase
    .from("boards")
    .update(board)
    .eq("id", boardId);

  if (error) {
    console.error("Error updating boards:", error);
    throw new Error(`Error updating boards: ${error.message}`);
  }

  console.log(board.name);
  revalidatePath(`/${board.name}`);
  return data;
}

export async function getBoards() {
  const { data: boards, error } = await supabase.from("boards").select("*");

  if (error) {
    console.error("Error fetching boards:", error);
    throw new Error(`Error fetching boards: ${error.message}`);
  }

  return boards;
}

export async function getBoardByname(boardName: string | string[] | false) {
  const boards = await getBoards();

  const board = boards.find(
    (b) =>
      b.name.toLowerCase() ===
      (typeof boardName === "string" && boardName.toLowerCase())
  );

  return board;
}

export async function addTaskToBoard(boardId: number, newTask: object) {
  // Fetch the current tasks
  const { data: board, error: fetchError } = await supabase
    .from("boards")
    .select("tasks, name")
    .eq("id", boardId)
    .single();

  if (fetchError) {
    console.error("Error fetching tasks:", fetchError);
    return;
  }

  // Append the new task to the tasks array
  const updatedTasks = [...board.tasks, newTask];

  // Update the tasks array in the board
  const { data, error } = await supabase
    .from("boards")
    .update({ tasks: updatedTasks })
    .eq("id", boardId);

  if (error) {
    console.error("Error adding task:", error);
  } else {
    console.log("Task added successfully:", data);
  }
  revalidatePath(`/${board.name}`);

  return data;
}

type task = {
  name: string;
  status: string;
  description: string;
  taskId: string;
  subtasks: string[];
};

export async function editTask(boardId: number, taskId: string, newTask: task) {
  // Fetch the current tasks
  const { data: board, error: fetchError } = await supabase
    .from("boards")
    .select("tasks, name")
    .eq("id", boardId)
    .single();

  if (fetchError) {
    console.error("Error fetching tasks:", fetchError);
    return;
  }

  // Find the index of the task to edit
  const taskIndex = board.tasks.findIndex(
    (task: task) => task.taskId === taskId
  );

  if (taskIndex === -1) {
    console.error("Task not found");
    return;
  }

  // Update the specific task in the array
  const updatedTasks = board.tasks.map((task: task, index: number) =>
    index === taskIndex ? { ...task, ...newTask } : task
  );

  // Update the tasks array in the board
  const { data, error } = await supabase
    .from("boards")
    .update({ tasks: updatedTasks })
    .eq("id", boardId);

  if (error) {
    console.error("Error updating task:", error);
  } else {
    console.log("Task updated successfully:", data);
  }

  revalidatePath(`/${board.name}`);
  return data;
}

export async function deleteTask(boardId: number, taskId: string) {
  const { data: board, error: fetchError } = await supabase
    .from("boards")
    .select("tasks, name")
    .eq("id", boardId)
    .single();

  if (fetchError) {
    console.error("Error fetching tasks:", fetchError);
    return;
  }

  // Find the index of the task to delete
  const taskIndex = board.tasks.findIndex(
    (task: task) => task.taskId === taskId
  );

  if (taskIndex === -1) {
    console.error("Task not found");
    return;
  }

  // Remove the task from the array
  const updatedTasks = board.tasks.filter(
    (bd: task, index: number) => index !== taskIndex
  );

  // Update the tasks array in the board
  const { data, error } = await supabase
    .from("boards")
    .update({ tasks: updatedTasks })
    .eq("id", boardId);

  if (error) {
    console.error("Error deleting task:", error);
  } else {
    console.log("Task deleted successfully:", data);
  }

  revalidatePath(`/${board.name}`);
  return data;
}

export async function deleteBoard(boardId: number) {
  const { error } = await supabase.from("boards").delete().eq("id", boardId);

  if (error) {
    console.error("Error deleting board:", error);
  } else {
    console.log("Board deleted successfully");
  }

  revalidatePath("/");
  redirect("/");
}
