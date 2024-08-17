"use client";

import { useDarkMode } from "@/app/_contexts/DarkModeContext";
import { useEffect } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const { isDarkMode } = useDarkMode();
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`rounded-lg shadow-lg max-w-md w-full p-6 relative ${
          isDarkMode ? "nav-dark-mode" : "nav-light-mode"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h2
              className={`text-xl font-semibold ${
                title.toLowerCase().includes("delete") ? "text-accent-600" : ""
              }`}
            >
              {title}
            </h2>
          )}
          <button
            className="text-2xl font-bold text-gray-600 hover:text-gray-800"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className={``}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
