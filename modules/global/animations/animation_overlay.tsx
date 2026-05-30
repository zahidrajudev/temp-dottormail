"use client";

import { useEffect, useRef, useState } from "react";

interface props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  overflow?: string;
  overlayBg?: string;
  initial?: string;
  visible?: string;
  transition?: string;
  duration?: string;
  delay?: string;
  once?: boolean;
}

const AnimationOverlay = ({
  children,
  className = "",
  overflow = "overflow-hidden",
  overlayBg = "bg-white",
  initial = "translate-x-full",
  visible = "translate-x-0",
  transition = "transition-transform",
  duration = "duration-1000",
  delay = "",
  once = true,
  ...props
}: props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          if (once) setHasAnimated(true);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      const raf = requestAnimationFrame(() => {
        observer.observe(currentRef);
      });
      return () => {
        cancelAnimationFrame(raf);
        observer.unobserve(currentRef);
      };
    }
  }, [once, hasAnimated]);

  const animClass = isVisible ? visible : initial;

  return (
    <div ref={ref} className={`relative ${className} ${overflow}`} {...props}>
      {children}
      <div className={`absolute top-0 left-0 w-full h-full ${overlayBg} ${transition} ${duration} ${delay} ${animClass}`}></div>
    </div>
  );
};
export default AnimationOverlay;