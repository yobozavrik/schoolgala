import { motion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface TileProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
}

export const Tile = ({ title, description, icon, to }: PropsWithChildren<TileProps>) => {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className="flex h-full flex-col items-start gap-3 rounded-2xl bg-skin-base/60 p-4 text-left shadow-md transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-skin-primary"
      aria-label={`${title}: ${description}`}
    >
      <div className="inline-flex rounded-full bg-skin-primary/15 p-3 text-skin-primary">{icon}</div>
      <div>
        <div className="text-base font-semibold text-skin-text">{title}</div>
        <div className="text-sm text-skin-muted">{description}</div>
      </div>
    </motion.button>
  );
};
