import { useState } from "react";
import { motion } from "framer-motion";
import { CHARACTER_MAP } from "@/lib/characters";

export type CharacterType = "alpaca" | "dino" | "panda" | "otter" | "lobster" | "penguin";

interface CharacterSelectProps {
  onSelect: (type: CharacterType) => void;
  isLoading?: boolean;
}

const characters: { type: CharacterType; label: string; emoji: string }[] = [
  { type: "otter", label: "Otters", emoji: "🦦" },
  { type: "penguin", label: "Penguins", emoji: "🐧" },
  { type: "lobster", label: "Lobsters", emoji: "🦞" },
  { type: "alpaca", label: "Alpacas", emoji: "🦙" },
  { type: "dino", label: "Dinos", emoji: "🦕" },
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-2xl px-2">
        {characters.map((char, i) => {
          const Comp = CHARACTER_MAP[char.type];
          return (
            <motion.button
              key={char.type}
              className={`flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl border-[3px] bg-card/50 transition-colors cursor-pointer min-h-[48px] ${
                selected === char.type ? "border-primary" : "border-border hover:border-primary"
              }`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(char.type)}
            >
              <div className="flex items-end gap-2">
                <Comp color="green" className="scale-[0.6] sm:scale-75" />
                <Comp color="pink" mirror className="scale-[0.6] sm:scale-75" />
              </div>
              <span className="text-lg sm:text-xl text-foreground">
                {char.emoji} {char.label}
              </span>
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
