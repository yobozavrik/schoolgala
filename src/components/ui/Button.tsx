import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: ButtonSize;
};

export const Button = ({
  asChild,
  className,
  variant = "primary",
  size = "md",
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skin-primary focus-visible:ring-offset-2 focus-visible:ring-offset-skin-base",
        size === "md" && "px-4 py-2",
        size === "sm" && "px-3 py-1.5 text-xs",
        variant === "primary" && "bg-skin-primary text-white shadow-md hover:shadow-lg",
        variant === "secondary" &&
          "bg-skin-base text-skin-text border border-skin-ring/60 hover:border-skin-primary",
        variant === "ghost" && "bg-transparent text-skin-text hover:bg-skin-base/60",
        variant === "outline" &&
          "border border-skin-ring/60 bg-transparent text-skin-text hover:border-skin-primary",
        className,
      )}
      {...props}
    />
  );
};
