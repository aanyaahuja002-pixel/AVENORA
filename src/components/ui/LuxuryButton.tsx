import React from "react";

interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "peach" | "glass";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function LuxuryButton({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  children,
  className = "",
  disabled,
  ...props
}: LuxuryButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-sans tracking-[0.16em] uppercase text-xs transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#263C50] disabled:opacity-50 disabled:cursor-not-allowed group";

  const sizeStyles = {
    sm: "px-4 py-2 text-[10px] gap-2 rounded-full",
    md: "px-6 py-3 text-xs gap-2.5 rounded-full",
    lg: "px-8 py-4 text-xs gap-3 rounded-full",
  };

  const variantStyles = {
    primary:
      "bg-[#FFF9F4] text-[#263C50] font-medium hover:bg-[#FFFFFF] shadow-[0_4px_20px_rgba(255,249,244,0.15)] hover:shadow-[0_6px_25px_rgba(246,185,157,0.3)] hover:-translate-y-0.5",
    outline:
      "bg-transparent border border-[#B9D7E8]/40 text-[#FFF9F4] hover:border-[#FFF9F4] hover:bg-[#FFF9F4]/10 hover:-translate-y-0.5",
    peach:
      "bg-[#F6B99D] text-[#263C50] font-medium hover:bg-[#F6B99D]/90 shadow-[0_4px_20px_rgba(246,185,157,0.25)] hover:-translate-y-0.5",
    glass:
      "bg-[#263C50]/60 backdrop-blur-md border border-[#B9D7E8]/30 text-[#FFF9F4] hover:bg-[#263C50]/80 hover:border-[#FFF9F4]/60 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(38,60,80,0.37)]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </button>
  );
}
