// components/useMegaDropdown.js
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";

export const useMegaDropdown = ({ mode = "hover" } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const buttonRef = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter();
  const hoverTimeoutRef = useRef(null);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
    };
    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);
    return () => window.removeEventListener("resize", checkTouchDevice);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Handle hover in with debounce
  const handleHoverIn = useCallback(() => {
    if (mode !== "hover" || isTouchDevice) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsOpen(true);
  }, [mode, isTouchDevice]);

  // Handle hover out with debounce
  const handleHoverOut = useCallback(() => {
    if (mode !== "hover" || isTouchDevice) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, [mode, isTouchDevice]);

  // Toggle on click/tap
  const handleClick = useCallback(() => {
    if (isTouchDevice || mode === "click") {
      setIsOpen((prev) => !prev);
    }
  }, [mode, isTouchDevice]);

  // Close when clicking outside (for click mode and touch devices)
  useEffect(() => {
    if (mode !== "click" && !isTouchDevice) return;

    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mode, isTouchDevice]);

  // Close on route change
  useEffect(() => {
    const closeDropdown = () => setIsOpen(false);
    router.events.on("routeChangeStart", closeDropdown);
    return () => router.events.off("routeChangeStart", closeDropdown);
  }, [router]);

  // Memoize the button component
  const DropdownButton = useCallback(
    ({ children, className = "" }) => (
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleHoverIn}
        onMouseLeave={handleHoverOut}
        onTouchStart={isTouchDevice ? handleClick : undefined}
        className={`${className} focus:outline-none`}
        aria-expanded={isOpen}
        aria-haspopup="true">
        {children}
      </button>
    ),
    [isOpen, handleClick, handleHoverIn, handleHoverOut, isTouchDevice]
  );

  // Memoize the content component
  const DropdownContent = useCallback(
    ({ children, className = "" }) => (
      <div
        ref={contentRef}
        onMouseEnter={mode === "hover" && !isTouchDevice ? handleHoverIn : undefined}
        onMouseLeave={mode === "hover" && !isTouchDevice ? handleHoverOut : undefined}
        className={`${className} absolute z-50`}
        style={{ display: isOpen ? "block" : "none" }}>
        {children}
      </div>
    ),
    [isOpen, mode, handleHoverIn, handleHoverOut, isTouchDevice]
  );

  return { DropdownButton, DropdownContent, isOpen, setIsOpen };
};
