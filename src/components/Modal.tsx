import { AnimatePresence, motion } from "framer-motion";
import { PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

export const Modal = ({ open, onClose, title, children }: PropsWithChildren<ModalProps>) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal
          aria-labelledby="modal-title"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-skin-card p-6 shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="modal-title" className="text-lg font-semibold">
                {title}
              </h2>
              <button
                type="button"
                className="rounded-full p-2 text-skin-muted transition hover:bg-skin-base"
                onClick={onClose}
                aria-label="Закрити"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm text-skin-muted">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};
