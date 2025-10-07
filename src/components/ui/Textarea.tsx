import { clsx } from "clsx";
import type { TextareaHTMLAttributes } from "react";

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={clsx(
        "w-full rounded-2xl border border-skin-ring/60 bg-skin-card px-4 py-3 text-sm transition duration-200 ease-out placeholder:text-skin-muted focus:border-skin-primary",
        className,
      )}
      {...props}
    />
  );
};
