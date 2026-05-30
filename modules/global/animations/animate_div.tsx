"use client";

import { useEffect, useRef, useState } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  initial?: string;
  visible?: string;
  transition?: string;
  duration?: string;
  delay?: string;
  once?: boolean;
}

const AnimationDiv = ({
  children,
  className = "",
  initial = "opacity-0 translate-y-8",
  visible = "opacity-100 translate-y-0",
  transition = "transition-all ease-out",
  duration = "duration-700", // 700ms is generally smoother for professional UI than 1000ms
  delay = "",
  once = true,
  ...props
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve immediately if we only want it to animate once
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once]);

  const animClass = isVisible ? visible : initial;

  // Notice the addition of 'h-full' to ensure it stretches inside Grid/Flex parents
  const combinedClasses = `h-full ${transition} ${duration} ${delay} ${animClass} ${className}`;

  return (
    <div ref={ref} className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default AnimationDiv;
