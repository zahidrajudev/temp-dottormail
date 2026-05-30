import { useEffect, useRef, useState, RefObject } from "react";

export const InViewPort = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          //observer.unobserve(ref.current); // Remove if you want it to trigger only once
        } else {
          setInView(false);
        }
      },
      {
        threshold: 0, // <-- 0% or around 1 pixel area appera to visible to be considered in view, also if we want we can set 0.1 to 10%
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, inView] as [RefObject<HTMLDivElement>, boolean];
};
