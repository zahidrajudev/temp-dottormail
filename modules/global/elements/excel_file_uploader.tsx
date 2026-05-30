import { useState } from "react";
import ExcelJS from "exceljs";
import FileInput from "@/modules/global/input/file";
import { toast } from "sonner";

interface FileInfo {
  name?: string;
  size?: number;
  type?: string;
  total?: number;
}

interface Props {
  setData: any;
  disabled: boolean;
  showFileInfo: boolean;
  fileInfo: any;
  setFileInfo: (fileInfo: FileInfo) => void;
  showLoading: boolean;
  setLoading: (loading: boolean) => void;
  className?: string;
  bg?: string;
  border?: string;
  fileClass?: string;
}

const ExcelUploader = ({ setData, disabled, showFileInfo, fileInfo, setFileInfo, showLoading, setLoading, className, bg, border, fileClass }: Props) => {
  const [uploadFile, setUploadfile] = useState<File | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0 || !bytes) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeExtraSpaces = (str: string): string => {
    return str.replace(/\s+/g, " ").trim();
  };

  const handleFileUpload = (file: File) => {
    setData([]);
    setFileInfo({ name: file?.name, size: file?.size, type: file?.type });

    if (file.size > 10000000) {
      toast.error("File Size Can not be more than 10 MB");
      return;
    }

    if (showLoading) {
      setLoading(true);
    }

    setUploadfile(file);

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          toast.error("No worksheet found in the file");
          if (showLoading) setLoading(false);
          return;
        }

        // Extract all rows as arrays of values
        const sheetData: any[][] = [];
        for (let i = 1; i <= worksheet.rowCount; i++) {
          const row = worksheet.getRow(i);
          const rowValues: any[] = [];
          // Get each cell value (colNumber starts at 1)
          for (let j = 1; j <= row.cellCount; j++) {
            const cell = row.getCell(j);
            rowValues.push(cell.value);
          }
          sheetData.push(rowValues);
        }

        // Filter out completely empty rows (rows with no cells or all empty)
        const nonEmptydata = sheetData.filter(
          (dataObj: any[]) => Array.isArray(dataObj) && dataObj.length > 0 && dataObj.some((cell) => cell !== null && cell !== undefined && cell !== ""),
        );

        if (nonEmptydata.length === 0) {
          toast.error("No data found in the file");
          if (showLoading) setLoading(false);
          return;
        }

        // Get headers from first row and clean them
        const headers = (nonEmptydata[0] as any[]).map((header: any) => removeExtraSpaces(header?.toString() || ""));

        // Process data rows (skip first row which contains headers)
        const resultData = nonEmptydata.slice(1).map((row: any[], rowIndex: number) => {
          const rowData: any = {};

          headers.forEach((header: string, index: number) => {
            // Handle cases where row might have fewer columns than headers
            const value = row[index] !== undefined ? row[index] : "";
            // Convert to string, handling null/undefined/date etc.
            let stringValue = "";
            if (value !== null && value !== undefined) {
              if (value instanceof Date) {
                stringValue = value.toISOString();
              } else if (typeof value === "object") {
                stringValue = JSON.stringify(value);
              } else {
                stringValue = value.toString();
              }
            }
            rowData[header] = stringValue;
          });

          return rowData;
        });

        // Filter out completely empty rows
        const filteredData = resultData.filter((row: any) => Object.values(row).some((value) => value && value.toString().trim() !== ""));

        setFileInfo({
          name: file?.name,
          size: file?.size,
          type: file?.type,
          total: filteredData?.length,
        });

        setData(filteredData);

        if (showLoading) {
          setLoading(false);
        }

        // toast.success(`Successfully processed ${filteredData.length} records`);
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing file");
        if (showLoading) setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <FileInput className={className} setFiles={(files: any) => handleFileUpload(files)} disabled={disabled} bg={bg} border={border} fileClass={fileClass} />
      {showFileInfo && fileInfo && (
        <div className="flex flex-wrap justify-center items-center text-xs">
          <div className="px-2 py-1 m-2 border border-gray-300 rounded-full dark:text-gray-300">
            <span className="font-semibold">File Name :</span> {fileInfo?.name}
          </div>
          <div className="px-2 py-1 m-2 border border-gray-300 rounded-full dark:text-gray-300">
            <span className="font-semibold">File Size :</span> {formatBytes(fileInfo?.size || 0)}
          </div>
          <div className="px-2 py-1 m-2 border border-gray-300 rounded-full dark:text-gray-300">
            <span className="font-semibold">Total Records :</span> {fileInfo?.total}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
