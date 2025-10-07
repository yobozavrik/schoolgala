import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  action?: ReactNode;
}

export const AccordionItem = ({
  title,
  subtitle,
  defaultOpen = false,
  action,
  children,
}: PropsWithChildren<AccordionItemProps>) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-skin-ring/60 bg-skin-card">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div>
          <div className="text-sm font-semibold text-skin-text">{title}</div>
          {subtitle ? <div className="text-xs text-skin-muted">{subtitle}</div> : null}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <ChevronDown
            className="h-4 w-4 text-skin-muted transition"
            style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
            aria-hidden
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden px-4 pb-4 text-sm text-skin-muted"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  children: ReactNode;
  className?: string;
}

export const Accordion = ({ children, className }: AccordionProps) => (
  <div className={`space-y-3 ${className ?? ""}`}>{children}</div>
);
