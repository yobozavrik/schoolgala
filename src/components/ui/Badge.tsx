import { clsx } from "clsx";
import type { PropsWithChildren } from "react";

interface BadgeProps {
  className?: string;
  variant?: "default" | "soft" | "outline";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-skin-base/70 text-skin-primary",
  soft: "bg-skin-primary/10 text-skin-primary",
  outline: "border border-skin-ring/60 bg-transparent text-skin-text",
};

export const Badge = ({ children, className, variant = "default" }: PropsWithChildren<BadgeProps>) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
);
