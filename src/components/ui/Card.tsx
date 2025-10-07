import type { PropsWithChildren } from "react";
import { clsx } from "clsx";

interface CardProps {
  className?: string;
}

export const Card = ({ children, className }: PropsWithChildren<CardProps>) => (
  <div className={clsx("rounded-2xl bg-skin-card p-4 shadow-md", className)}>{children}</div>
);
