"use client";

import SvgIcon from "@/modules/global/icons/svg_icons";
import { useState } from "react";

interface YesNoSwitchProps {
  value?: boolean; // true = YES, false = NO
  onChange?: (value: boolean) => void;
  positiveText?: string;
  negativeText?: string;
}

export default function Switch({ value = true, onChange, positiveText = "YES", negativeText = "NO" }: YesNoSwitchProps) {
  const toggle = () => {
    const newValue = !value;
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={toggle}
        className={`relative w-22 px-2 h-8 ${value ? "bg-green-50 border-green-600" : "bg-red-50 border-red-500"} shadow-custom-5 border rounded-full overflow-hidden transition-all duration-500`}>
        {/* Sliding Circle */}
        <div
          className={`z-11 absolute top-0.75 bottom-1 w-8 h-6 flex items-center justify-center rounded-full transition-all duration-500 ease-in-out ${value ? "left-[55%] bg-green-600" : "left-2 bg-red-500"}`}>
          <SvgIcon name={value ? "check" : "close"} className="size-4 text-white" filled />
        </div>

        {/* Labels */}
        <div className="relative z-10 flex h-full w-full text-sm font-semibold select-none">
          {/* YES */}
          <div className={`flex w-1/2 items-center justify-center transition-colors duration-500 ${value ? "text-green-700" : "text-white invisible"}`}>{positiveText}</div>

          {/* NO */}
          <div className={`flex w-1/2 items-center justify-center transition-colors duration-500 ${value ? "text-white invisible" : "text-red-600"}`}>{negativeText}</div>
        </div>
      </button>
    </div>
  );
}
