import { motion } from "framer-motion";

export const TypingDots = () => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((dot) => (
      <motion.span
        key={dot}
        className="h-2 w-2 rounded-full bg-skin-muted/70"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1, delay: dot * 0.2 }}
      />
    ))}
  </div>
);
