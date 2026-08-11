import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useModalStack } from "../../context/ModalContext.jsx";

/**
 * Generic modal — pass isOpen/onClose (see useModal) and whatever children
 * you want rendered inside the card. Closes on backdrop click or Escape,
 * locks body scroll while open.
 *
 * Rendering and stacking (portal target, z-index, which modal Escape closes,
 * when body scroll unlocks) are all owned by ModalProvider — this component
 * just registers itself on the shared stack while open. Nest as many of
 * these as needed; they'll stack and unwind correctly regardless of order.
 */
export const Modal = ({ isOpen, onClose, children, className = "" }) => {
  const { push, pop, root } = useModalStack();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const id = push(() => onCloseRef.current());
    return () => pop(id);
  }, [isOpen, push, pop]);

  if (!root) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 flex items-center justify-center bg-bg/95 backdrop-blur-md p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative glass-card rounded-2xl border border-accent/20 shadow-[0_0_60px_var(--accent-glow)] max-w-lg w-full max-h-[85vh] overflow-hidden ${className}`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="interactive absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface/80 border border-glass-border text-muted hover:text-accent hover:border-accent/40 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
            {/* Scroll happens in here, not on the rounded outer card — keeps
                the scrollbar clipped to the corners instead of poking past
                them, and keeps the close button pinned above the content. */}
            <div data-lenis-prevent className="modal-scroll max-h-[85vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    root
  );
};
