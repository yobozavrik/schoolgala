import { clsx } from "clsx";
import type { PropsWithChildren } from "react";

interface BadgeProps {
  className?: string;
}

export const Badge = ({ children, className }: PropsWithChildren<BadgeProps>) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full bg-skin-base/70 px-3 py-1 text-xs font-semibold text-skin-primary",
      className,
    )}
  >
    {children}
  </span>
);
