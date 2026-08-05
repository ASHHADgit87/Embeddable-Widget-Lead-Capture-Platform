import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-blue-700 bg-blue-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-green",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
