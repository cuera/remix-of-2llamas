import { motion } from "framer-motion";
import { useMemo } from "react";

const HEART_EMOJIS = ["❤️", "💕", "💖"];
const HEARTS = Array.from({ length: 25 });

const ConfettiHearts = () => {
  const hearts = useMemo(
    () =>
      HEARTS.map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        size: 16 + Math.random() * 12,
        duration: 4 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 60,
        emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
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
            top: -40,
            fontSize: h.size,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, h.drift],
            opacity: [1, 1, 0.6],
            rotate: [0, 20, -20, 10],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        >
          {h.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default ConfettiHearts;
