import { useEffect, useState } from "react";

export const TrackHeightWidth = () => {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [totalHeight, setTotalHeight] = useState<number | null>(null);
  const [totalWidth, setTotalWidth] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState<string | null>(null);
  const [scrollX, setScrollX] = useState<string | null>(null);
  const [scrollYPercentage, setScrollYPercentage] = useState<string | null>(null);
  const [scrollXPercentage, setScrollXPercentage] = useState<string | null>(null);

  useEffect(() => {
    const updateSizes = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
      setTotalHeight(document.documentElement.scrollHeight);
      setTotalWidth(document.documentElement.scrollWidth);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY.toFixed(2));
      setScrollX(window.scrollX.toFixed(2));
      setScrollYPercentage(((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100).toFixed(2));
      setScrollXPercentage(((window.scrollX / (document.documentElement.scrollWidth - window.innerWidth)) * 100).toFixed(2));
    };

    // Initial update
    updateSizes();
    handleScroll();

    // Attach event listeners
    window.addEventListener("resize", updateSizes);
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateSizes);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    viewportHeight,
    viewportWidth,
    totalHeight,
    totalWidth,
    scrollY,
    scrollX,
    scrollYPercentage,
    scrollXPercentage,
  };
};
