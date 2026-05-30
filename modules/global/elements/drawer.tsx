import React from "react";
import SvgIcon from "../icons/svg_icons";
import Section from "./section";

interface DefaultDrawerProps {
  children: React.ReactNode;
  position: "top" | "bottom" | "left" | "right";
  permission?: boolean;
  loading: boolean;
  show: boolean;
  set_show: (show: boolean) => void;
  className?: string;
}

function DefaultDrawer({ children, position, permission = true, loading, show, set_show, className = "border-l-4 border-gray-200 bg-white shadow-2xl" }: DefaultDrawerProps) {
  const handleStyle = (_show: boolean, _position: string): string => {
    let styles = "";
    if (_position === "top") {
      styles += _show ? "top-0 left-0 translate-y-0 w-full" : "top-0 left-0 -translate-y-full w-full invisible";
    } else if (_position === "bottom") {
      styles += _show ? "bottom-0 left-0 translate-y-0 w-full" : "bottom-0 left-0 translate-y-full w-full invisible";
    } else if (_position === "left") {
      styles += _show ? "top-0 left-0 translate-x-0 h-full" : "top-0 left-0 -translate-x-full h-full invisible";
    } else if (_position === "right") {
      styles += _show ? "top-0 right-0 translate-x-0 h-full" : "top-0 right-0 translate-x-full h-full invisible";
    }
    return styles;
  };

  const handleCloseButtonStyle = (_position: string): string => {
    switch (_position) {
      case "top":
        return "-bottom-4 left-1/2 px-2";
      case "bottom":
        return "-top-4 left-1/2 px-2";
      case "left":
        return "-right-4 top-1/2 py-2";
      case "right":
        return "-left-4 top-1/2 py-2";
      default:
        return "";
    }
  };

  const rotateIcon = (_position: string): string => {
    switch (_position) {
      case "left":
        return "rotate-90";
      case "right":
        return "-rotate-90";
      default:
        return "";
    }
  };

  return (
    <div className={`fixed z-51 transition-all duration-1000 ${handleStyle(show, position)}`}>
      <Section fullWidth permission={permission} loading={loading} outerClassName={`relative w-full h-full ${className}`}>
        <div
          onClick={() => set_show(false)}
          className={`absolute ${handleCloseButtonStyle(position)} bg-blue-100 rounded-full cursor-pointer hover:bg-blue-950 text-blue-950 hover:text-white`}>
          <SvgIcon name="keyboard_arrow_down" className={`size-7 text-xl opacity-50 hover:opacity-100 ${rotateIcon(position)}`} />
        </div>
        {children}
      </Section>
    </div>
  );
}

export default DefaultDrawer;
