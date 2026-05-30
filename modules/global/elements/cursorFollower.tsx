"use client";

import { useEffect, useRef } from "react";

export default function CursorFollower() {
  const ballRef = useRef<HTMLDivElement>(null);
  const rippleWrapperRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("ontouchstart" in window) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const speed = 0.12;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const click = () => {
      if (!rippleRef.current) return;

      rippleRef.current.classList.remove("ripple-active");
      void rippleRef.current.offsetWidth; // restart animation
      rippleRef.current.classList.add("ripple-active");
    };

    const animate = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;

      const x = currentX - 12;
      const y = currentY - 12;

      if (ballRef.current) {
        ballRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (rippleWrapperRef.current) {
        rippleWrapperRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", click);

    animate();

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", click);
    };
  }, []);

  return (
    <>
      {/* Ripple */}
      <div ref={rippleWrapperRef} className="pointer-events-none fixed top-0 left-0 z-9998">
        <div
          ref={rippleRef}
          className="
            size-4
            rounded-full
            opacity-0
            border border-violet-600
          "
        />
      </div>

      {/* Ball */}
      <div
        ref={ballRef}
        className="
          pointer-events-none
          fixed top-0 left-0 z-9999
          size-4
          rounded-full
          bg-linear-to-br
          from-fuchsia-500/80
          to-violet-500/80
          blur-[1px]
        "
      />
    </>
  );
}
