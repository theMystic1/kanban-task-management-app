import React from "react";

type button = {
  children: React.ReactNode;
  type: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function Button({
  children,
  type = "primary",
  disabled = false,
  onClick,
}: button) {
  return (
    <button
      className={`px-5 py-2 flex gap-3 items-center justify-center rounded-3xl text-lg font-semibold transition duration-500 shadow-lg  capitalize ${
        type === "primary" && !disabled
          ? "bg-purpple-600 hover:bg-purpple-400 text-purpple-100"
          : type === "danger" && !disabled
          ? "bg-accent-600 hover:bg-accent-300 text-purpple-100"
          : type === "secondary" && !disabled
          ? "bg-purpple-200 hover:bg-purpple-100 text-purpple-600"
          : ""
      } ${
        disabled
          ? "cursor-not-allowed  text-purpple-100  bg-purpple-400"
          : "cursor-pointer"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
