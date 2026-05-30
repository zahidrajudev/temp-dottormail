import { useEffect, useState, useRef } from "react";
import { InViewPort } from "@/hooks/tracking/in_view_port";
import SvgIcon from "@/modules/global/icons/svg_icons";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://your-backend-domain.com";
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://your-frontend-domain.com";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | undefined;
  alt?: string;
  className?: string;
  image_className?: string;
  lazy_load?: boolean;
  zoom_on_hover?: boolean;
  show_placeholder?: boolean;
  source_type?: "backend" | "frontend" | "other";
}

export default function ImageBox({
  src = "",
  alt = "Image",
  className = "",
  image_className = "object-cover",
  lazy_load = false,
  zoom_on_hover = false,
  show_placeholder = true,
  source_type = "backend",
  ...props
}: Props) {
  const [ref, inView] = InViewPort();
  const imgRef = useRef<HTMLImageElement>(null);

  // State
  const [shouldLoad, setShouldLoad] = useState(!lazy_load);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 1. Handle Lazy Loading
  useEffect(() => {
    if (lazy_load && inView && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [lazy_load, inView, shouldLoad]);

  // 2. Handle Cached Images
  // Sometimes images load so fast the onLoad event is missed
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [shouldLoad, src]);

  const getImageUrl = (path: string, type: string) => {
    if (!path) return "";
    if (type === "backend") return path.startsWith("/") ? BACKEND_URL + path : BACKEND_URL + "/" + path;
    if (type === "frontend") return path.startsWith("/") ? FRONTEND_URL + path : FRONTEND_URL + "/" + path;
    return path;
  };

  const finalSrc = getImageUrl(src, source_type);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* --- Placeholder Overlay --- */}
      {show_placeholder && (
        <div
          className={`
            absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-300 z-10 
            transition-opacity duration-500 ease-in-out
            ${isLoaded && !hasError ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}>
          <SvgIcon name="image" className={`w-2/3 h-2/3 max-w-20 max-h-20 ${!isLoaded && !hasError && src ? "animate-pulse" : ""}`} />
        </div>
      )}

      {/* --- Actual Image --- */}
      {shouldLoad && src && (
        <img
          ref={imgRef}
          src={finalSrc}
          alt={alt}
          onLoad={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
          onError={() => {
            setHasError(true);
            setIsLoaded(false);
            console.error("ImageBox: Failed to load", finalSrc);
          }}
          className={`
            max-w-full max-h-full block
            ${image_className}
            ${zoom_on_hover ? "hover:scale-110" : ""}
            ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
          {...props}
        />
      )}
    </div>
  );
}
