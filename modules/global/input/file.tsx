import React, { useRef, ChangeEvent } from "react";

interface FileInputProps {
  setFiles: (files: File[] | File) => void;
  accept?: string;
  multiple?: boolean;
  handle?: boolean; // If true, will pass the FileList object directly
  disabled?: boolean;
  bg?: string;
  border?: string;
  className?: string;
  showInstructions?: boolean;
  instructions?: string | string[];
  showExampleDocument?: boolean;
  documentUrl?: string;
  id?: string;
  text?: string;
  fileClass?: string;
}

const FileInput = ({
  setFiles,
  accept,
  multiple = false,
  handle = false,
  disabled = false,
  bg = "bg-white",
  border = "border-2 border-gray-600/30 border-dashed rounded",
  className = "py-10",
  fileClass = "file:border-0 file:py-1 file:px-3 file:mr-4 file:bg-cyan-600 file:hover:bg-cyan-800 file:text-white disabled:file:bg-gray-400",
  showInstructions = false,
  instructions = "Only .xlsx, .xls, .csv file are allowed",
  showExampleDocument = false,
  documentUrl = "",
  id = "",
  text = "Drag and Drop or Select Files",
}: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    if (handle) {
      // If handle is true, we pass the FileList object
      setFiles(multiple ? Array.from(event.target.files) : event.target.files[0]);
    } else {
      // Default behavior - just pass the files
      if (multiple) {
        setFiles(Array.from(event.target.files));
      } else {
        setFiles(event.target.files[0]);
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    target.value = "";
  };

  return (
    <label htmlFor={id || "uploadFile"} className={`flex w-full items-center justify-center cursor-pointer ${bg} ${border} ${className}`}>
      <div className="w-auto">
        <input
          type="file"
          id={id}
          multiple={multiple}
          accept={accept}
          onClick={handleClick}
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={disabled}
          className={`w-full ${fileClass} text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-gray-800`}
        />
        <ul className="list-disc list-inside">
          <li className="text-sm font-medium text-gray-400 mt-2">{text}</li>
          {showInstructions &&
            (Array.isArray(instructions) ? (
              instructions.map((ins, index) => (
                <li key={`note-${index}`} className="text-sm font-medium text-gray-400 mt-2">
                  {ins}
                </li>
              ))
            ) : (
              <li className="text-sm font-medium text-gray-400 mt-2">{instructions}</li>
            ))}
          {showExampleDocument && documentUrl && (
            <li className="text-sm font-medium text-gray-400 mt-2">
              <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="underline" download>
                Download Sample Document
              </a>
            </li>
          )}
        </ul>
      </div>
    </label>
  );
};

export default FileInput;
