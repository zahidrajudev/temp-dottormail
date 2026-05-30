import { useState, ChangeEvent } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";

interface CustomInputProps extends React.HTMLAttributes<HTMLDivElement> {
  labelShow?: boolean;
  label?: string;
  labelClass?: string;

  type?: string;
  id?: string;
  className?: string;
  border?: string;
  padding?: string;
  extraClass?: string;

  iconShow?: boolean;
  iconName?: string;
  iconFilled?: boolean;
  iconClass?: string;
  iconSide?: "left" | "right";

  required?: boolean;
  value: string | number;
  setValue: (val: string) => void;

  notes?: string[];
  errorMessage?: string;
  successMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  noteClass?: string;
}

const Input = ({
  labelShow = true,
  label = "Label",
  labelClass = "pb-2",

  type = "text",
  id = "id",
  className = "w-full focus:outline-none focus:ring-0 placeholder:text-gray-300 disabled:opacity-50",
  border = "border border-cyan-200 rounded focus:border-cyan-600",
  padding = "pl-10 py-2.5",
  extraClass = "bg-cyan-50/40 focus:bg-white",

  iconShow = true,
  iconName = "short_text",
  iconFilled = false,
  iconClass = "size-5 opacity-75",
  iconSide = "left",

  required = false,
  value = "",
  setValue,

  notes = [],
  errorMessage = "",
  successMessage = "",
  placeholder = "Type here ...",
  disabled = false,
  noteClass = "pt-1 text-gray-500 text-xs",

  ...props
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const finaltype = showPassword && isPasswordType ? "text" : type;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // notify parent only
  };

  const togglePasswordVisibility = () => {
    if (isPasswordType) setShowPassword((prev) => !prev);
  };

  const iconPadding = iconShow ? (iconSide === "left" ? "pl-12" : "pr-12") : "";
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
        <input
          id={id}
          name={id}
          type={finaltype}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`${className} ${extraClass} ${border} ${padding}`}
          {...props}
        />

        {iconShow && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute top-0 ${iconSide === "left" ? "left-1" : "right-1"} flex items-center px-2 h-full cursor-pointer`}
            aria-label="Toggle icon"
          >
            <SvgIcon name={isPasswordType ? (showPassword ? "visibility" : "visibility_off") : iconName} filled={iconFilled} className={iconClass} />
          </button>
        )}
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
};

export default Input;
