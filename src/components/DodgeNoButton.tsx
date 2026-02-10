import { motion } from "framer-motion";

interface DodgeNoButtonProps {
  color: "green" | "pink";
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
  dodgeCount: number;
  onDodge: () => void;
}

const DODGE_LABELS = [
  "NO",
  "NO",
  "Wait really? 🥺",
  "Pookie please...",
  "Pookie please...",
  "...",
];

const DodgeNoButton = ({ color, selected, onClick, disabled, dodgeCount, onDodge }: DodgeNoButtonProps) => {
  const borderColor = color === "green" ? "hsl(var(--alpaca-green))" : "hsl(var(--alpaca-pink))";
  const bgColor = selected ? borderColor : "transparent";
  const textColor = selected ? "hsl(var(--background))" : "hsl(var(--foreground))";

  const label = DODGE_LABELS[Math.min(dodgeCount, DODGE_LABELS.length - 1)];

  // Progressive scaling: shrinks at step 3+
  const scale = dodgeCount >= 4 ? 0.5 : dodgeCount >= 3 ? 0.7 : 1;
  const opacity = dodgeCount >= 4 ? 0.3 : 1;
  // Slide right progressively
  const xOffset = dodgeCount >= 4 ? 90 : dodgeCount >= 3 ? 70 : dodgeCount >= 2 ? 50 : dodgeCount >= 1 ? 30 : 0;

  const handleInteraction = () => {
    if (disabled) return;
    if (dodgeCount < 5) {
      onDodge();
    }
  };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={handleInteraction}
      onTouchStart={(e) => {
        if (dodgeCount < 5) {
          e.preventDefault();
          handleInteraction();
        }
      }}
      disabled={disabled}
      className="px-5 py-2 text-lg font-hand rounded-md border-[3px] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        borderColor,
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "'Patrick Hand', cursive",
      }}
      animate={{
        x: xOffset,
        scale,
        opacity,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileTap={{ scale: scale * 0.9 }}
    >
      {label}
    </motion.button>
  );
};

export default DodgeNoButton;
