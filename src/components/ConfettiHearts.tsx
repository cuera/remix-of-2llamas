import { motion } from "framer-motion";
import { useMemo } from "react";

const HEARTS = Array.from({ length: 30 });

const ConfettiHearts = () => {
  const hearts = useMemo(
    () =>
      HEARTS.map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        size: 14 + Math.random() * 18,
        duration: 2.5 + Math.random() * 2,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.x}%`,
            top: -30,
            fontSize: h.size,
          }}
          initial={{ y: -30, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: [0, 30, -30, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            ease: "easeIn",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

export default ConfettiHearts;
