import React, { useEffect, useState } from "react";
import DropdownAndTooltip from "@/modules/global/elements/dropdown_tooltip";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Button from "@/modules/global/elements/button";
import pageTranslation from "@/modules/language/components/PageTranslation";
import { useLanguageStore } from "@/modules/language/store/useLanguageStore";

interface TableProps {
  data: any[];
  loading: boolean;
  excludeKeys?: string[];
  checkChilds?: boolean;
  notFoundText?: string;
  showHeading?: boolean;
  headerBg?: string;
  headerBorder?: string;
  bodyTableRowBg?: string;
  showMark?: boolean;
  markItems?: any[];
  setMarkItems?: React.Dispatch<React.SetStateAction<any[]>>;
  showDelete?: boolean;
  showTrash?: boolean;
  handleTrash?: () => void;
  handleDelete?: () => void;
  showRestore?: boolean;
  handleRestore?: () => void;
  className?: string;
  isChildAccording?: boolean;
  markDropdownItems?: React.ReactNode | string;
}

const Table = ({
  data,
  loading,
  excludeKeys = [],
  checkChilds,
  notFoundText = "No data available",
  showHeading = true,
  headerBg = "bg-linear-to-l from-cyan-500 to-teal-500 text-white",
  headerBorder = "border-l border-white",
  bodyTableRowBg = "hover:bg-gray-50 odd:bg-cyan-50 even:bg-teal-50",
  showMark,
  markItems = [],
  setMarkItems = () => {},
  showDelete = true,
  showTrash,
  handleTrash,
  handleDelete,
  showRestore,
  handleRestore,
  className = "text-sm bg-white p-8 rounded-lg",
  markDropdownItems = "",
}: TableProps) => {
  const [headers, setHeaders] = useState<string[]>([]);
  const pageName = "table";
  const { appSelectedLocale } = useLanguageStore();
  const { t } = pageTranslation(pageName, appSelectedLocale?.code ?? "en");
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const keys = Object.keys(data[0]).filter((key) => !excludeKeys.includes(key));
      setHeaders(keys);
    } else {
      setHeaders([]);
    }
  }, [data]);

  if (!data || data.length === 0) {
    return loading ? (
      <div className="flex w-full justify-center p-2">
        <SvgIcon className="size-5 opacity-50" name="" loading={true} />
      </div>
    ) : (
      <p className="text-gray-500 text-center p-2">{notFoundText}</p>
    );
  }

  const formatHeader = (key: string, index: number) => {
    if (key.toLowerCase().includes("_hidden") || key.toLowerCase().includes("id")) return null;
    const formattedKey = key
      .replace("_date", "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return (
      <th key={`header-${index}`} className={`px-4 py-3 text-left font-semibold ${headerBorder}`}>
        {formattedKey}
      </th>
    );
  };

  const dateFormatter = (value: any) => {
    const date = new Date(typeof value === "object" ? value?.date : value);
    const user_name = typeof value === "object" ? value?.user : "";
    const formatted = `${date.getDate()} ${date.toLocaleString("us", { month: "short" })} ${date.getFullYear()}`;
    const time =
      `${date.getHours() % 12 || 12}`.padStart(2, "0") +
      ":" +
      `${date.getMinutes()}`.padStart(2, "0") +
      ":" +
      `${date.getSeconds()}`.padStart(2, "0") +
      ` ${date.getHours() >= 12 ? "PM" : "AM"}`;

    return (
      <div className="flex flex-col">
        <div>{formatted}</div>
        <div className="text-xs">{time}</div>
        {user_name && <div className="text-xs">{user_name}</div>}
      </div>
    );
  };

  const checkType = (value: any): string => {
    if (Array.isArray(value)) return "array";
    if (value instanceof Date) return "date";
    if (value && typeof value === "object") return "object";
    return typeof value;
  };

  const printResult = (value: any): React.ReactNode => {
    const type = checkType(value);
    if (type === "array") {
      return (
        <div className="grid grid-cols-1 gap-1">
          {value.map((item: any, index: number) => (
            <div key={index} className="flex gap-3">
              {printResult(item)}
            </div>
          ))}
        </div>
      );
    }
    if (type === "object") {
      return (
        <div className="grid grid-cols-1 gap-1">
          {Object.entries(value).map(([key, val], index) => (
            <div key={index} className="flex gap-3">
              <div className="text-indigo-950">{key}:</div>
              {printResult(val)}
            </div>
          ))}
        </div>
      );
    }
    return <div>{String(value)}</div>;
  };

  const actionManager = (type: string, value?: any) => {
    switch (type) {
      case "mark_item":
        setMarkItems((prev) => [...new Set([...prev, value])]);
        break;
      case "unmark_item":
        setMarkItems((prev) => prev.filter((id) => id !== value));
        break;
      case "mark_all":
        setMarkItems(data.map((item) => item.id));
        break;
      case "unmark_all":
        setMarkItems([]);
        break;
      case "restore_items":
        handleRestore && handleRestore();
        break;
      case "trash_items":
        handleTrash && handleTrash();
        break;
      case "delete_items":
        handleDelete && handleDelete();
        break;
    }
  };

  const prepareTD = (header: string, row: any) => {
    if (header.toLowerCase().includes("_hidden") || header.toLowerCase().includes("id")) return null;
    const content = header.toLowerCase().includes("_date") ? dateFormatter(row[header]) : checkChilds ? printResult(row[header]) : row[header];
    return (
      <td key={header} className="px-4 py-3 text-sm text-black">
        {content}
      </td>
    );
  };

  return (
    <div className={`overflow-x-auto w-full rounded ${data.length && ""}`}>
      <table className={`min-w-full h-full table-auto ${className} border-separate border-spacing-y-1`}>
        {showHeading && (
          <thead>
            <tr className={`${headerBg} ${headerBorder}`}>
              {showMark && (
                <th className="w-36 px-4 py-3 text-left font-semibold">
                  <DropdownAndTooltip
                    side="middle"
                    position="bottom"
                    width="w-[240px]"
                    button={
                      <div className="w-full flex items-center gap-2.5 cursor-pointer">
                        <SvgIcon name="sync_alt" className="text-white size-5" />
                        {t("actions")}
                        <SvgIcon name="keyboard_arrow_down" className="text-white size-5" />
                      </div>
                    }
                  >
                    <div className="pt-2">
                      <div className="flex flex-col w-full bg-white shadow-custom-6 rounded text-sm text-gray-900 p-2">
                        <div onClick={() => actionManager("mark_all")} className="w-full">
                          <Button
                            py="py-3"
                            showIcon
                            iconName="check_box"
                            iconPosition="before"
                            iconFilled
                            iconClass="size-6 text-green-600"
                            className="flex items-center justify-start w-full hover:font-semibold hover:bg-cyan-500 hover:text-white"
                          >
                            {t("mark_all")}
                          </Button>
                        </div>
                        <div onClick={() => actionManager("unmark_all")} className="w-full">
                          <Button
                            py="py-3"
                            showIcon
                            iconName="check_box_outline_blank"
                            iconPosition="before"
                            iconFilled
                            iconClass="size-6 text-gray-500"
                            className="flex items-center justify-start w-full hover:font-semibold hover:bg-cyan-500 hover:text-white"
                          >
                            {t("unmark_all")}
                          </Button>
                        </div>
                        {showRestore && (
                          <div onClick={() => actionManager("restore_items")} className="w-full">
                            <Button
                              py="py-3"
                              showIcon
                              iconName="history"
                              iconPosition="before"
                              iconFilled
                              iconClass="size-6 text-green-600"
                              className="flex items-center justify-start w-full hover:font-semibold hover:bg-cyan-500 hover:text-white"
                              disabled={!markItems.length}
                            >
                              {t("restore_selected")} ({markItems.length})
                            </Button>
                          </div>
                        )}
                        {showTrash && (
                          <div onClick={() => actionManager("trash_items")} className="w-full">
                            <Button
                              py="py-3"
                              showIcon
                              iconName="delete"
                              iconPosition="before"
                              iconFilled
                              iconClass="size-6 text-red-600"
                              className="flex items-center justify-start w-full hover:font-semibold hover:bg-cyan-500 hover:text-white"
                              disabled={!markItems.length}
                            >
                              {t("move_to_trash")} ({markItems.length})
                            </Button>
                          </div>
                        )}
                        {showDelete && (
                          <div onClick={() => actionManager("delete_items")} className="w-full">
                            <Button
                              py="py-3"
                              showIcon
                              iconName="delete"
                              iconPosition="before"
                              iconFilled
                              iconClass="size-6 text-red-600"
                              className="flex items-center justify-start w-full hover:font-semibold hover:bg-cyan-500 hover:text-white"
                              disabled={!markItems.length}
                            >
                              {t("delete_forever")} ({markItems.length})
                            </Button>
                          </div>
                        )}
                        {markDropdownItems}
                      </div>
                    </div>
                  </DropdownAndTooltip>
                </th>
              )}
              {headers.map((header, i) => formatHeader(header, i))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={bodyTableRowBg}>
              {showMark && (
                <td
                  onClick={() => (markItems.includes(row.id) ? actionManager("unmark_item", row.id) : actionManager("mark_item", row.id))}
                  className="px-4 py-3 text-gray-600 text-center group cursor-pointer"
                >
                  {markItems.includes(row.id) ? (
                    <SvgIcon name="check_box" filled className="size-6 text-cyan-700" />
                  ) : (
                    <SvgIcon name="check_box_outline_blank" className="size-6 text-cyan-600" />
                  )}
                </td>
              )}
              {headers.map((header) => prepareTD(header, row))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
