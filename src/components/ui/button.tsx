import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1a0525] text-white border border-[#5f2eb2]/50 hover:bg-[#24073a] hover:border-[#8d5cff]/60",

  secondary:
    "bg-gradient-to-r from-[#8d5cff] via-[#b184ff] to-[#dbaefd] text-white border border-white/20 hover:brightness-110",
  ghost:
    "bg-transparent text-white/70 border border-transparent hover:bg-white/5 hover:text-white",
  danger:
    "bg-gradient-to-r from-[#ff5c8d] via-[#ff7f7f] to-[#ffb199] text-white hover:brightness-110",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-bold transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
