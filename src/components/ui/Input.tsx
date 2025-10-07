import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl border border-skin-ring/60 bg-skin-card px-4 py-2 text-sm transition duration-200 ease-out placeholder:text-skin-muted focus:border-skin-primary",
        className,
      )}
      {...props}
    />
  );
};
