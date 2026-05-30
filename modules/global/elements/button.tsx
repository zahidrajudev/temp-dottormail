import React, { ButtonHTMLAttributes } from "react";
import SvgIcon from "@/modules/global/icons/svg_icons";
import { AppLink } from "@/lib/AppLink";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "solid" | "outline" | "ghost" | "link" | "";
  className?: string;
  linkClassName?: string;

  // Icon props
  showIcon?: boolean;
  iconName?: string;
  iconFilled?: boolean;
  iconClass?: string;
  iconPosition?: "before" | "after";

  // Layout & Shape props
  border?: string; // e.g., "rounded-full"
  px?: string; // e.g., "px-8"
  py?: string; // e.g., "py-4"

  // Logic props
  url?: string;
  loading?: boolean;
  disabled?: boolean;
}

const Button = ({
  children,
  className = "inline-flex items-center justify-center bg-linear-to-l from-cyan-500 to-teal-500 text-white font-semibold hover:opacity-75 hover:scale-105 duration-500",
  linkClassName = "",
  variant = "",
  showIcon = false,
  iconName = "arrow_right_alt",
  iconFilled = false,
  iconClass = "w-5 h-5",
  iconPosition = "after",
  border = "rounded-xl",
  px = "px-5",
  py = "py-2.5",
  url,
  loading = false,
  disabled = false,
  type = "button",
  ...props
}: ButtonProps) => {
  // 1. Variant Styles
  const variantStyles = {
    solid: "bg-violet-600 text-white hover:bg-violet-700",
    outline: "border border-violet-600 text-violet-600 hover:bg-violet-50",
    ghost: "text-violet-600 hover:bg-violet-50",
    link: "text-violet-600 underline-offset-4 hover:underline !p-0 !h-auto",
  };

  // 2. Base Classes
  const baseClasses = `cursor-pointer gap-2 font-semibold transition-all ${variant && variantStyles[variant]} ${
    variant !== "link" ? `${px} ${py} ${className}` : linkClassName
  }  ${border} ${disabled || loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"} 
  `.trim();

  // 3. Icon Helper
  const renderIcon = () => {
    if (loading) return <SvgIcon name="loading" className={`${iconClass} animate-spin`} />;
    if (!showIcon || !iconName) return null;
    return <SvgIcon name={iconName} filled={iconFilled} className={iconClass} />;
  };

  const content = (
    <>
      {iconPosition === "before" && renderIcon()}
      {children && <>{children}</>}
      {iconPosition === "after" && renderIcon()}
    </>
  );

  // 4. Conditional Wrapper (Link vs Button)
  if (url && !disabled && !loading) {
    return (
      <AppLink href={url} className={baseClasses}>
        {content}
      </AppLink>
    );
  }

  return (
    <button {...props} type={type} className={baseClasses} disabled={disabled || loading}>
      {content}
    </button>
  );
};

export default Button;
