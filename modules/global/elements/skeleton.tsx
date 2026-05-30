import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  animation?: boolean;
  width?: string | number;
  height?: string | number;
  size?: string | number; // Shortcut for setting both w & h (great for avatars)
}

const Skeleton = ({ className = "", variant = "text", animation = true, width, height, size, style, ...props }: Props) => {
  // 1. Base Styles
  const baseClass = `bg-gray-200 dark:bg-gray-700/50 ${animation ? "animate-pulse" : ""}`;

  // 2. Variants (Shapes)
  const getVariantClasses = () => {
    switch (variant) {
      case "circular":
        return "rounded-full shrink-0"; // shrink-0 prevents avatar from getting squished
      case "rectangular":
        return "rounded-none";
      case "rounded":
        return "rounded-xl";
      case "text":
      default:
        return "rounded-md";
    }
  };

  // 3. Dynamic Styles
  // If 'size' is passed, it overrides width/height.
  // If width/height are passed as numbers, we assume pixels.
  const computedStyles: React.CSSProperties = {
    width: size || width,
    height: size || height,
    ...style, // Allows you to pass specific maxWidth/minHeight via style prop if needed
  };

  return <div className={`${baseClass} ${getVariantClasses()} ${className}`} style={computedStyles} {...props} />;
};

export default Skeleton;
