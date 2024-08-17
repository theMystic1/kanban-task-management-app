import { ReactNode } from "react";

type props = {
  label: string;
  children: ReactNode;
  labelFor: string;
  needBoarder?: boolean;
  error?: string;
};

function Input({ label, children, labelFor, needBoarder, error }: props) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={labelFor} className="text-grayy-200 ">
        {label}
      </label>

      <div
        className={`border-grayy-200 w-full min-h-10 rounded-md flex items-center ${
          needBoarder ? "border" : ""
        } relative`}
      >
        {children}

        {!error ? null : (
          <p className="absolute top-0 bottom-0 right-2 text-red-500  flex items-center  justify-center">
            {error ? error : ""}
          </p>
        )}
      </div>
    </div>
  );
}

export default Input;
