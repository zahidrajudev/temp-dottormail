"use client";
import React, { useState, createContext, useContext } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";

const AccordionContext = createContext<{
  openId: string | null;
  toggle: (id: string) => void;
}>({ openId: null, toggle: () => {} });

export const Accordion = ({ children, defaultOpenId = null }: { children: React.ReactNode; defaultOpenId?: string | null }) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="flex flex-col gap-1">{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ id, title, children, isShort }: any) => {
  const { openId, toggle } = useContext(AccordionContext);
  const isOpen = openId === id;

  return (
    <div className="w-full">
      <button
        onClick={() => toggle(id)}
        className={`flex items-center w-full gap-3 p-3 rounded-xl transition-all ${
          isOpen
            ? "bg-linear-to-r from-cyan-600/10 to-fuchsia-600/10 text-cyan-600"
            : "hover:bg-linear-to-r hover:from-cyan-600/10 hover:to-fuchsia-600/10 hover:text-cyan-600"
        }`}
      >
        <div className="shrink-0">{title.icon}</div>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex-1 ${!isShort ? "opacity-100 w-full" : "opacity-0 w-0"}`}>
          <span className="block text-left text-sm font-semibold whitespace-nowrap w-50">{title.label}</span>
        </div>

        {!isShort && <SvgIcon name="chevron_right" className={`text-cyan-600/50 size-6 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />}
      </button>

      <div className={`grid transition-all duration-300 ${isOpen && !isShort ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 pl-4 pr-2 pb-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

// import React, { useState } from "react";
// import SvgIcon from "@/modules/global/icons/svg_icons";

// interface ItemProps {
//   id: string;
//   title?: string | React.ReactNode;
//   children: React.ReactNode;
//   isOpen?: boolean;
//   onClick?: (id: string) => void;
//   iconPosition?: "left" | "right";
//   showIcon?: boolean;
//   // Styling
//   headingClass?: string;
//   bodyClass?: string;
//   className?: string;
//   activeClass?: string;
// }

// export const AccordionItem = ({
//   id,
//   title,
//   children,
//   isOpen,
//   onClick,
//   iconPosition = "right",
//   showIcon = true,
//   headingClass = "p-4 font-medium",
//   bodyClass = "p-4 pt-0 text-gray-600",
//   className = "border-b border-gray-200",
//   activeClass = "bg-gray-50",
// }: ItemProps) => {
//   return (
//     <div className={`transition-colors duration-300 ${className} ${isOpen ? activeClass : ""}`}>
//       {/* Header */}
//       <button type="button" onClick={() => onClick?.(id)} className={`flex w-full items-center justify-between text-left transition-all ${headingClass}`}>
//         {showIcon && iconPosition === "left" && <SvgIcon name="chevron_right" className={`size-5 mr-3 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />}

//         <div className="flex-1">{title}</div>

//         {showIcon && iconPosition === "right" && <SvgIcon name="chevron_right" className={`size-5 ml-3 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />}
//       </button>

//       {/* Smooth Height Animation Wrapper */}
//       <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
//         <div className="overflow-hidden">
//           <div className={bodyClass}>{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface MainProps {
//   defaultOpenId?: string | null;
//   children: React.ReactElement<ItemProps> | React.ReactElement<ItemProps>[];
//   className?: string;
//   allowToggleAll?: boolean; // If true, can close the current one to have all closed
// }

// export const Accordion = ({ children, defaultOpenId = null, className = "" }: MainProps) => {
//   const [openId, setOpenId] = useState<string | null>(defaultOpenId);

//   const handleToggle = (id: string) => {
//     setOpenId(openId === id ? null : id);
//   };

//   return (
//     <div className={`overflow-hidden ${className}`}>
//       {React.Children.map(children, (child) => {
//         if (!React.isValidElement(child)) return null;
//         return React.cloneElement(child, {
//           isOpen: openId === child.props.id,
//           onClick: handleToggle,
//         } as Partial<ItemProps>);
//       })}
//     </div>
//   );
// };
