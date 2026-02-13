import { motion } from "framer-motion";

interface DodgeNoButtonProps {
  color: "green" | "pink";
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
  dodgeCount: number;
  onDodge: () => void;
  customStyle?: React.CSSProperties;
}

const DODGE_LABELS = [
  "NO",
  "NO",
  "Wait really? 🥺",
  "But look how cute we are...",
  "Pookie please... 🥹",
  "...",
];

const DodgeNoButton = ({ color, selected, onClick, disabled, dodgeCount, onDodge, customStyle }: DodgeNoButtonProps) => {
  const defaultBorder = color === "green" ? "hsl(var(--brand-green))" : "hsl(var(--brand-pink))";
  const borderColor = customStyle?.borderColor ?? defaultBorder;
  const bgColor = selected ? (borderColor as string) : "transparent";
  const textColor = selected ? "hsl(var(--background))" : "hsl(var(--foreground))";

  const label = DODGE_LABELS[Math.min(dodgeCount, DODGE_LABELS.length - 1)];

  const scale = dodgeCount >= 5 ? 0.3 : dodgeCount >= 4 ? 0.5 : dodgeCount >= 3 ? 0.7 : 1;
  const opacity = dodgeCount >= 5 ? 0.3 : dodgeCount >= 4 ? 0.5 : 1;
  const xOffset = dodgeCount * 40;

  const handleInteraction = () => {
    if (disabled) return;
    if (dodgeCount < 6) {
      onDodge();
    }
  };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={handleInteraction}
      onTouchStart={(e) => {
        if (dodgeCount < 6) {
          e.preventDefault();
          handleInteraction();
        }
      }}
      disabled={disabled}
      className="px-5 py-2 text-lg font-hand rounded-md border-[3px] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-h-[48px]"
      style={{
        borderColor,
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "'Patrick Hand', cursive",
        fontSize: dodgeCount >= 4 ? "0.7rem" : customStyle?.fontSize ?? undefined,
        padding: customStyle?.padding,
        opacity: customStyle?.opacity,
      }}
      animate={{
        x: xOffset,
        scale,
        opacity,
      }}
      transition={{ type: "spring", damping: 15, stiffness: 120 }}
      whileTap={{ scale: scale * 0.9 }}
    >
      {label}
    </motion.button>
  );
};

export default DodgeNoButton;
