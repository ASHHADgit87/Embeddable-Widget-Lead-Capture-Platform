import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-graphite-100 outline-none transition placeholder:text-graphite-400 focus:border-accent",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
