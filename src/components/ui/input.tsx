import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-[#5b2f99]/60 bg-[#1a0630]/80 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#9b5cf0] focus:ring-1 focus:ring-[#9b5cf0]/25",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
