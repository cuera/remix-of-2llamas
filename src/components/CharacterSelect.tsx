import { useState } from "react";
import { motion } from "framer-motion";
import { CHARACTER_MAP } from "@/lib/characters";

export type CharacterType = "alpaca" | "llama" | "panda" | "otter" | "lobster" | "penguin";

interface CharacterSelectProps {
  onSelect: (type: CharacterType) => void;
  isLoading?: boolean;
}

const characters: { type: CharacterType; label: string; emoji: string }[] = [
  { type: "otter", label: "Otters", emoji: "🦦" },
  { type: "penguin", label: "Penguins", emoji: "🐧" },
  { type: "lobster", label: "Lobsters", emoji: "🦞" },
  { type: "alpaca", label: "Alpacas", emoji: "🦙" },
  { type: "llama", label: "Llamas", emoji: "🦙" },
  { type: "panda", label: "Pandas", emoji: "🐼" },
];

const SPRING = { type: "spring" as const, damping: 15, stiffness: 120 };

const CharacterSelect = ({ onSelect, isLoading = false }: CharacterSelectProps) => {
  const [selected, setSelected] = useState<CharacterType | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl text-foreground mb-4 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING}
      >
        BE MY VALENTINE?
      </motion.h1>

      <motion.p
        className="text-xl sm:text-2xl text-muted-foreground mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Pick your characters! 💕
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 w-full max-w-md md:max-w-4xl px-4 perspective-1000">
        {characters.map((char, i) => {
          const Comp = CHARACTER_MAP[char.type];
          const isSelected = selected === char.type;

          return (
            <motion.button
              key={char.type}
              className={`relative group flex flex-col items-center justify-between
                         aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden
                         border transition-all duration-500 ease-out
                         ${isSelected
                  ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(233,30,139,0.4)] scale-[1.02]"
                  : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1"
                }`}
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1 * i,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(char.type)}
            >
              {/* Character Display Area with Float Animation */}
              <motion.div
                className="flex-1 w-full flex items-center justify-center gap-1 sm:gap-2 pb-6 md:pb-0"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                  delay: i * 0.5 // Stagger animations
                }}
              >
                <div className="relative z-10 scale-[0.55] sm:scale-[0.65] md:scale-[0.8] transition-transform duration-500 group-hover:scale-[0.6] sm:group-hover:scale-[0.7] md:group-hover:scale-[0.85]">
                  <Comp color="green" />
                </div>
                <div className="relative z-10 scale-[0.55] sm:scale-[0.65] md:scale-[0.8] transition-transform duration-500 group-hover:scale-[0.6] sm:group-hover:scale-[0.7] md:group-hover:scale-[0.85]">
                  <Comp color="pink" mirror />
                </div>
              </motion.div>

              {/* Label Badge with Slide-up Effect on Hover */}
              <div className={`absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 
                              flex items-center gap-1.5 px-3 py-1.5 md:px-5 md:py-2 rounded-full 
                              backdrop-blur-md border shadow-sm transition-all duration-300
                              ${isSelected
                  ? "bg-primary text-white border-primary translate-y-0 opacity-100"
                  : "bg-black/30 text-white/90 border-white/10 group-hover:bg-black/50 group-hover:scale-105"
                }`}>
                <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
                  {char.emoji} {char.label}
                </span>
              </div>

              {/* Selection Effect Ring */}
              {isSelected && (
                <motion.div
                  layoutId="selection-ring"
                  className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}

              {/* Hover highlight gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.button>
          );
        })}
      </div>

      <motion.button
        className="mt-10 w-full max-w-sm py-4 text-2xl rounded-lg text-primary-foreground font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 bg-primary min-h-[48px]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={selected && !isLoading ? { scale: 1.05 } : {}}
        whileTap={selected && !isLoading ? { scale: 0.95 } : {}}
        disabled={!selected || isLoading}
        onClick={() => selected && !isLoading && onSelect(selected)}
      >
        {isLoading ? 'Creating... 💌' : 'Create & Share 💝'}
      </motion.button>
    </div>
  );
};

export default CharacterSelect;
