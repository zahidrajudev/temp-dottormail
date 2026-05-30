import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
  button: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  side?: "left" | "right" | "middle";
  width?: string;
  toggleClick?: boolean;
  toggleHover?: boolean;
  closeWhenClickInside?: boolean;
  className?: string;
}

const DropdownAndTooltip = ({
  children,
  button,
  position = "bottom",
  side = "left",
  width = "w-auto",
  toggleClick = true,
  toggleHover = false,
  closeWhenClickInside = true,
  className = "",
}: Props) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // States
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, minWidth: 0 });

  // 1. Fix Hydration: Mark as mounted only on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Position Calculation Logic
  const updatePosition = () => {
    if (!open || !triggerRef.current || !dropdownRef.current) return;

    const t = triggerRef.current.getBoundingClientRect();
    const d = dropdownRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    // Y-Axis
    if (position === "bottom") top = t.bottom + scrollY + 8;
    if (position === "top") top = t.top + scrollY - d.height - 8;

    // X-Axis
    if (side === "left") left = t.left + scrollX;
    if (side === "right") left = t.right + scrollX - d.width;
    if (side === "middle") left = t.left + scrollX + t.width / 2 - d.width / 2;

    // Responsive: Prevent going off-screen
    const padding = 10;
    const screenWidth = window.innerWidth;
    if (left + d.width > screenWidth - padding) left = screenWidth - d.width - padding;
    if (left < padding) left = padding;

    setCoords({ top, left, minWidth: t.width });
  };

  useLayoutEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [open, position, side]);

  // 3. Close on Outside Click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <>
      {/* Trigger element remains in the DOM tree */}
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onClick={() => toggleClick && setOpen((p) => !p)}
        onMouseEnter={() => toggleHover && setOpen(true)}
        onMouseLeave={() => toggleHover && setOpen(false)}>
        {button}
      </div>

      {/* IMPORTANT: Only render the Portal on the client side 
          to prevent "Hydration Failed" errors.
      */}
      {mounted &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
              minWidth: width === "w-full" ? `${coords.minWidth}px` : "auto",
              // We keep it in the DOM but hidden when closed for better performance
              visibility: open ? "visible" : "hidden",
            }}
            className={`
            ${width}
            transition-all duration-200 ease-out transform
            ${open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"}
          `}
            onClick={() => closeWhenClickInside && setOpen(false)}>
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

export default DropdownAndTooltip;
