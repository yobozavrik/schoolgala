import { motion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface TileProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  badge?: string;
  badgeTone?: "primary" | "emerald" | "sky" | "amber";
}

const badgeToneClasses: Record<NonNullable<TileProps["badgeTone"]>, string> = {
  primary: "bg-skin-primary/15 text-skin-primary",
  emerald: "bg-emerald-100 text-emerald-700",
  sky: "bg-sky-100 text-sky-600",
  amber: "bg-amber-100 text-amber-600",
};

export const Tile = ({ title, description, icon, to, badge, badgeTone = "primary" }: PropsWithChildren<TileProps>) => {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className="flex h-full flex-col items-start gap-3 rounded-2xl border border-skin-ring/40 bg-skin-base/60 p-4 text-left shadow-md transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-skin-primary"
    >
      <div className="inline-flex rounded-full bg-skin-primary/15 p-3 text-skin-primary">{icon}</div>
      <div>
        <div className="text-base font-semibold text-skin-text">{title}</div>
        <div className="text-sm text-skin-muted">{description}</div>
      </div>
      {badge ? (
        <span
          className={`mt-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            badgeToneClasses[badgeTone]
          }`}
        >
          {badge}
        </span>
      ) : null}
    </motion.button>
  );
};
