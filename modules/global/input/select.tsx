import { useEffect, useRef, useState } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { isValueSet } from "@/lib/helper";
import Input from "@/modules/global/input/input";

type ItemType = Record<string, any>;

interface CustomInputProps extends React.HTMLAttributes<HTMLDivElement> {
  labelShow?: boolean;
  label?: string;
  labelClass?: string;

  id?: string;
  className?: string;
  border?: string;
  padding?: string;
  extraClass?: string;
  placeholderClass?: string;

  iconShow?: boolean;
  iconName?: string;
  iconFilled?: boolean;
  iconClass?: string;
  iconSide?: "left" | "right";

  required?: boolean;
  value: string | number | (string | number)[];
  setValue: (val: any) => void;

  notes?: string[];
  errorMessage?: string;
  successMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  noteClass?: string;

  items?: ItemType[];
  itemLabelName?: string;
  itemValueName?: string;
  isTranslate?: boolean;
  multiSelect?: boolean;
  showUnselect?: boolean;
  showSearch?: boolean;
  searchInputClass?: string;
  searchInputBorder?: string;
  searchInputExtraClass?: string;
  dropdownClass?: string;
  dropdownMaxheight?: string;
  dropdownItemClass?: string;
  dropdownItemActiveClass?: string;
  dropdownItemExtraClass?: string;
  dropdownOnlyCanShow?: boolean;
  dropdownOnlyCanClose?: boolean;
  dropdownPosition?: "top" | "bottom" | "left" | "right";
  dropdownSide?: "top" | "bottom" | "left" | "right" | "middle" | "left-right" | "right-left";
  dropdownWidth?: string;
  dropdownToggleClick?: boolean;
  dropdownToggleHover?: boolean;
}

const Select = ({
  labelShow = true,
  label = "Label",
  labelClass = "pb-2",

  id = "id",
  className = "w-full focus:outline-none focus:ring-0 placeholder:text-gray-300 disabled:opacity-50",
  border = "border border-cyan-200 rounded focus:border-cyan-600",
  padding = "pl-3 py-2.5",
  extraClass = "bg-cyan-50/40 focus:bg-white",
  placeholderClass = "text-gray-300",

  iconShow = true,
  iconName = "keyboard_arrow_down",
  iconFilled = true,
  iconClass = "size-5 opacity-75",
  iconSide = "right",

  required = false,
  value = "",
  setValue,

  notes = [],
  errorMessage = "",
  successMessage = "",
  placeholder = "Click Here to Select Option",
  disabled = false,
  noteClass = "pt-1 text-gray-500 text-xs",

  items = [],
  itemLabelName = "name",
  itemValueName = "id",
  isTranslate = false,
  multiSelect = false,
  showUnselect = false,
  showSearch = false,
  searchInputClass = "w-full placeholder:text-gray-400 disabled:opacity-50",
  searchInputBorder = "rounded border border-gray-200 focus:ring-0",
  searchInputExtraClass = "text-sm pl-8",
  dropdownClass = "bg-white border-2 border-gray-100 rounded",
  dropdownMaxheight = "max-h-72 max-w-full",
  dropdownItemClass = "pl-4 pr-2 py-2 hover:bg-gray-100",
  dropdownItemActiveClass = "",
  dropdownItemExtraClass = "",
  dropdownPosition = "bottom",
  dropdownSide = "middle",
  dropdownWidth = "w-full",
  dropdownToggleClick = true,
  dropdownToggleHover = false,
  dropdownOnlyCanShow = false,
  dropdownOnlyCanClose = false,
  ...props
}: CustomInputProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredItems, setFilteredItems] = useState<ItemType[]>(items);
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(true);
  };

  const isSelected = (itemValue: string | number) => {
    const itemValueString = String(itemValue);
    const valueString = Array.isArray(value) ? value.map((v) => String(v)) : String(value);
    if (multiSelect && Array.isArray(valueString)) return valueString.includes(itemValueString);
    return valueString == itemValueString;
  };

  const handleSelectItem = (itemValue: string | number) => {
    const normalizedValue = String(itemValue);

    if (multiSelect) {
      if (!Array.isArray(value)) {
        setValue([itemValue]);
        return;
      }

      const exists = value.some((v) => String(v) === normalizedValue);

      const updated = exists
        ? value.filter((v) => String(v) !== normalizedValue)
        : [...value.filter((v, i, self) => self.findIndex((x) => String(x) === String(v)) === i), itemValue]; // Optional dedupe

      setValue(updated);
      console.log(updated);
      return;
    }

    setValue(String(value) === normalizedValue ? "" : itemValue);
    setShowDropdown(false);
  };

  const dropdownPositionClass = () => {
    let base = `${dropdownWidth} absolute z-50 ${dropdownClass}`;
    let position = "";

    if (dropdownPosition === "bottom") {
      position += " top-full pt-2";
      if (dropdownSide === "middle") position += " left-1/2 -translate-x-1/2";
      else if (dropdownSide === "left") position += " right-0";
      else position += " left-0";
    } else if (dropdownPosition === "top") {
      position += " bottom-full pb-2";
      if (dropdownSide === "middle") position += " left-1/2 -translate-x-1/2";
      else if (dropdownSide === "left") position += " right-0";
      else position += " left-0";
    } else if (dropdownPosition === "left") {
      position += " right-full pr-2";
    } else if (dropdownPosition === "right") {
      position += " left-full pl-2";
    }

    return `${base} ${position}`;
  };

  const renderIcon = (name: string) => <SvgIcon name={name} filled={iconFilled} className={iconClass} />;

  const isValid = (_error: string, _value: string | number | (string | number)[]) => {
    if (typeof _error === "string" && _error?.trim() !== "") return false;
    if (Array.isArray(_value) && !_value.length) return false;
    if (typeof _value === "string" && _value.trim() == "") return false;
    return true;
  };

  const isDataToShow = (_items: ItemType[], _filterData: ItemType[], _searchString: string) => {
    const renderItems = _searchString?.trim() ? _filterData : _items;

    if (Array.isArray(renderItems) && renderItems.length) {
      return (
        <>
          {renderItems.map((item: any, idx: number) => {
            const itemKey = String(item[itemValueName]);
            const isActive = isSelected(itemKey);
            const label = isTranslate ? item?.translate?.[itemLabelName] : item[itemLabelName];
            return (
              <div
                key={idx}
                className={`cursor-pointer flex items-center gap-2 ${dropdownItemClass} ${dropdownItemExtraClass} ${isActive ? dropdownItemActiveClass : ""}`}
                onClick={() => handleSelectItem(itemKey)}>
                <SvgIcon name={isActive ? "check_circle" : "radio_button_unchecked"} filled={isActive} className="size-5" />
                <span>{label}</span>
              </div>
            );
          })}
        </>
      );
    }
    return <div className="p-2 text-center text-sm text-gray-400">No Data Found</div>;
  };

  const handleSearch = (value: string) => {
    setSearchString(value);
    setFilteredItems(
      items.filter((item) =>
        String(isTranslate ? item?.translate?.[itemLabelName] : item[itemLabelName])
          ?.toLowerCase()
          .includes(value.toLowerCase()),
      ),
    );
  };

  const returnNameFromValue = (val: string | number) => {
    const item = items.find((item) => item[itemValueName] == val);
    return item ? (isTranslate ? item?.translate?.[itemLabelName] : item[itemLabelName]) : "";
  };

  const printValue = (val: string | number | (string | number)[]) => {
    if (Array.isArray(val) && val.length) {
      return (
        <div className="flex flex-wrap gap-3">
          {val.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectItem(item)}
              className="relative overflow-hidden px-2 py-1 rounded bg-gray-100 hover:scale-110 duration-500 flex gap-2 items-center">
              {returnNameFromValue(item)}
              <div className="absolute top-0 right-0 w-full h-full hover:opacity-100 opacity-0 flex justify-center items-center cursor-pointer" title="Remove">
                <SvgIcon name="close" className="size-5 bg-red-600 p-1 rounded-full text-white" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    if ((isValueSet(val) && typeof val == "string") || typeof val == "number") {
      return returnNameFromValue(val);
    }
    return "";
  };

  return (
    <div className="flex flex-col max-w-full">
      {labelShow && (
        <label htmlFor={id} className={`flex items-center gap-2 ${labelClass}`}>
          <span>{label}</span>
          {required && (
            <span title={isValid(errorMessage, value) ? "Looks good" : errorMessage || "Field required"}>
              <SvgIcon
                name={isValid(errorMessage, value) ? "check" : "error"}
                filled
                className={isValid(errorMessage, value) ? "text-green-600 opacity-75 size-4" : "text-violet-500 opacity-75 size-4"}
              />
            </span>
          )}
        </label>
      )}

      <div ref={dropdownRef} className="relative w-full group">
        <div onClick={toggleDropdown} className={`${className} ${extraClass} ${border} ${padding}`}>
          {isValueSet(value) ? "" : <span className={placeholderClass}>{placeholder}</span>}
          {printValue(value)}
        </div>

        {iconShow && (
          <button
            type="button"
            className={`absolute top-0 ${iconSide === "left" ? "left-1" : "right-1"} flex items-center px-2 h-full hover:scale-200 cursor-pointer duration-500`}
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="Toggle"
            title={showDropdown ? "Close" : "Open"}>
            {renderIcon(showDropdown ? "close" : iconName)}
          </button>
        )}

        {showDropdown && (
          <div className={dropdownPositionClass()}>
            {showSearch && (
              <div className="relative max-w-full mx-4 py-2">
                <Input
                  value={searchString}
                  setValue={(val) => handleSearch(val)}
                  placeholder="Search Options"
                  autoFocus
                  iconName="search"
                  padding="py-1.5 pl-10"
                  labelShow={false}
                />
              </div>
            )}
            <div className={`${dropdownMaxheight} overflow-auto`}>{isDataToShow(items, filteredItems, searchString)}</div>
          </div>
        )}
      </div>

      {errorMessage && <p className="text-xs text-red-600 mt-1">{errorMessage}</p>}
      {successMessage && <p className="text-xs text-green-700 mt-1">{successMessage}</p>}

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

export default Select;
