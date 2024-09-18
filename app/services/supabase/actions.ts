"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { dataObj } from "@/app/_components/tasks/CreateNewBoard";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "../auth";
import { cookies } from "next/headers";

export async function createBoard(board: object, param: string) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
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
  revalidatePath("/boards");
  // redirect(`/${data}`);

  return data;
}

export async function updateBoard(board: dataObj, boardId: number | undefined) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const { data, error } = await supabase
    .from("boards")
    .update(board)
    .eq("id", boardId);

  if (error) {
    console.error("Error updating boards:", error);
    throw new Error(`Error updating boards: ${error.message}`);
  }

  revalidatePath(`/boards/${board.name}`);
  return data;
}

export async function getBoards() {
  const cookie = cookies().get("curuser");
  // Fetch all boards from the database
  const { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .eq("ownerId", cookie?.value);

  // Handle any errors that occurred during the fetch
  if (error) {
    console.error("Error fetching boards:", error);
    throw new Error(`Error fetching boards: ${error.message}`);
  }

  return boards;
}

export async function getBoardByname(boardName: string | string[] | false) {
  const user = cookies().get("curuser");
  if (!user) await signOutActionNoUser();
  const boards = await getBoards();

  const board = boards.find(
    (b) =>
      b.name.toLowerCase() ===
      (typeof boardName === "string" && boardName.toLowerCase())
  );

  return board;
}

export async function addTaskToBoard(boardId: number, newTask: object) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
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
  revalidatePath(`/boards/${board.name}`);
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
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
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

  revalidatePath(`/boards/${board.name}`);
  redirect(`/boards/${board.name}`);

  return data;
}

export async function deleteTask(boardId: number, taskId: string) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
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

  revalidatePath(`/boards`);
  redirect("/");
  return data;
}

export async function deleteBoard(boardId: number) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const { error } = await supabase.from("boards").delete().eq("id", boardId);

  if (error) {
    console.error("Error deleting board:", error);
  } else {
    console.log("Board deleted successfully");
  }

  revalidatePath("/boards");
  redirect("/boards");
}

// USERS

export async function getUserById(id: string | undefined) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", id)
    .single();

  return user;
}

export async function getUser(email: string | null | undefined) {
  // if (!email) {
  //   throw new Error("Email is required to fetch user data.");
  // }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // if (error) {
  //   console.error("Error getting user:", error.message);
  //   throw new Error(`Error getting user: ${error.message}`);
  // }

  return user;
}

type user = {
  id: string | undefined;
  email: string;
  image: string;
  name: string;
  // emailVerified: boolean;
};

export async function createUser(user: object) {
  const { data, error } = await supabase.from("users").insert([user]);

  if (error) {
    console.error("Error creating user:", error.message);
    throw new Error(`Error creating user: ${error.message}`);
  }

  return data;
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  cookies().delete("curuser");
}

export async function signOutActionNoUser() {
  await signOut({ redirectTo: "/login" });
}
