"use client";

import LeftNav from "./LeftNav";
import Nav from "./Nav";
import HideSideBar from "./HideSideBar";
import { useAside } from "@/app/_contexts/AsideContext";
import { useDarkMode } from "@/app/_contexts/DarkModeContext";
import React, { useEffect } from "react";
import { getBoards } from "@/app/services/supabase/actions";

// Define the type for a single board
export type Board = {
  id: number;
  name: string;
  tasks: object[]; // Define this according to your tasks structure
  // Add other fields as necessary
};
// Define the type for the list of boards
export type Boards = Board[];

function Main({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isClosed } = useAside();
  const { isDarkMode } = useDarkMode();

  const [loading, setLoading] = React.useState(false);
  const [board, setBoard] = React.useState<Boards>([]);

  useEffect(() => {
    async function fetchBoards() {
      setLoading(true);
      try {
        const boardData = await getBoards();
        setBoard(boardData);
      } catch (error: unknown) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBoards();
  }, []);

  // Function to add a new board to the list
  const handleBoardCreated = (newBoard: Board) => {
    setBoard((prevBoards) => [...prevBoards, newBoard]);
  };

  const handleBoardDeleted = (deletedBoardId: number) => {
    setBoard((prevBoard) =>
      prevBoard.filter((board) => board.id !== deletedBoardId)
    );
  };

  return (
    <>
      <main
        className={`min-h-screen relative ${
          isDarkMode ? "dark-mode" : "light-mode"
        }`}
      >
        <Nav onBoardDeleted={handleBoardDeleted} />
        <LeftNav
          board={board}
          loading={loading}
          onBoardCreated={handleBoardCreated} // Pass the callback function
        />
        {isClosed ? (
          <div className="absolute top-0 h-screen bottom-0 left-0 z-20">
            <HideSideBar />
          </div>
        ) : null}
        <div className="h-screen">{children}</div>
      </main>
    </>
  );
}

export default Main;
