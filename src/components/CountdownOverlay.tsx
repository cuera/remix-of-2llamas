import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownOverlayProps {
  onComplete: () => void;
}

const CountdownOverlay = ({ onComplete }: CountdownOverlayProps) => {
  const [count, setCount] = useState(3);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setFlash(true);
      const timer = setTimeout(() => onComplete(), 300);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: flash ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.4)" }}
      transition={{ duration: flash ? 0.15 : 0.3 }}
    >
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            className="text-8xl sm:text-9xl text-foreground select-none"
            style={{ fontFamily: "'Patrick Hand', cursive" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1.05, 1, 1.05, 1],
              opacity: 1,
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              scale: {
                times: [0, 0.25, 0.45, 0.55, 0.75, 0.85],
                duration: 0.9,
                ease: "easeOut",
              },
              opacity: { duration: 0.2 },
              exit: { duration: 0.15 },
            }}
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CountdownOverlay;
