import { useState } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";

interface CustomInputProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  labelShow?: boolean;
  label?: string;
  labelClass?: string;

  type?: string;
  id?: string;
  className?: string;
  border?: string;
  padding?: string;
  extraClass?: string;

  required?: boolean;
  value: string;
  setValue: (val: string) => void;

  notes?: string[];
  errorMessage?: string;
  successMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  noteClass?: string;

  rows?: number;
  cols?: number;
}

function TextArea({
  labelShow = true,
  label = "Label",
  labelClass = "pb-2",

  id = "id",
  className = "w-full focus:outline-none focus:ring-0 placeholder:text-gray-300 disabled:opacity-50",
  border = "border border-cyan-200 rounded focus:border-cyan-600",
  padding = "pl-5 py-2.5",
  extraClass = "bg-cyan-50/40 focus:bg-white",

  required = false,
  value = "",
  setValue,

  notes = [],
  errorMessage = "",
  successMessage = "",
  placeholder = "",
  disabled = false,
  noteClass = "pt-1 text-gray-500 text-xs",

  rows = 5,
  cols = 20,
}: CustomInputProps) {
  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };

  const showValidationIcon = required || !!errorMessage;
  const isValid = !errorMessage && value?.toString().trim() !== "";

  return (
    <div className="flex flex-col max-w-full">
      {labelShow && (
        <label htmlFor={id} className={`flex items-center gap-2 ${labelClass}`}>
          <span>{label}</span>
          {showValidationIcon && (
            <span title={isValid ? "Looks good" : errorMessage || "Field required"}>
              <SvgIcon name={isValid ? "check" : "error"} filled className={isValid ? "text-green-600 opacity-75 size-4" : "text-cyan-500 opacity-75 size-4"} />
            </span>
          )}
        </label>
      )}

      <div className="relative w-full group">
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`${className} ${extraClass} ${border} ${padding}`}
          rows={rows}
          cols={cols}
        />
      </div>

      {errorMessage && <div className="text-xs text-red-600 opacity-75 mt-1">{errorMessage}</div>}
      {successMessage && <div className="text-xs text-green-700 opacity-80 mt-1">{successMessage}</div>}

      {notes.length > 0 && (
        <ul className={`list-disc list-inside ${noteClass}`}>
          {notes.map((note, index) => (
            <li key={index} className="text-xs opacity-80">
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TextArea;
