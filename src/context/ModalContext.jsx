import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ModalContext = createContext(null);

let uid = 0;

/**
 * Owns the single portal root every <Modal> renders into, plus the ordered
 * stack of currently-open modals. Centralizing this here — instead of each
 * Modal instance managing its own portal/z-index/Escape-key/scroll-lock — is
 * what lets modals stack arbitrarily deep and unwind correctly no matter
 * which one closes first:
 *   - one shared portal root, elevated once (z-10000), so no descendant
 *     modal ever has to fight a z-index battle against page chrome again
 *   - later-opened modals are later siblings in that root, so they stack on
 *     top by plain DOM order — no per-modal z-index math needed
 *   - Escape closes only the top of the stack
 *   - body scroll locks on the 0→1 open transition and unlocks only once
 *     the stack empties back to 0, however many modals were involved
 */
export const ModalProvider = ({ children }) => {
  const [stack, setStack] = useState([]);
  const [root] = useState(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    el.className = "relative z-10000";
    return el;
  });

  useEffect(() => {
    if (!root) return;
    document.body.appendChild(root);
    return () => {
      document.body.removeChild(root);
    };
  }, [root]);

  const push = useCallback((onClose) => {
    const id = ++uid;
    setStack((s) => [...s, { id, onClose }]);
    return id;
  }, []);

  const pop = useCallback((id) => {
    setStack((s) => s.filter((entry) => entry.id !== id));
  }, []);

  const hasOpen = stack.length > 0;

  useEffect(() => {
    if (!hasOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [hasOpen]);

  const stackRef = useRef(stack);
  stackRef.current = stack;

  useEffect(() => {
    if (!hasOpen) return;
    const handleKey = (e) => {
      if (e.key !== "Escape") return;
      const top = stackRef.current[stackRef.current.length - 1];
      top?.onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [hasOpen]);

  return <ModalContext.Provider value={{ push, pop, root }}>{children}</ModalContext.Provider>;
};

export const useModalStack = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModalStack must be used within a ModalProvider");
  return ctx;
};
