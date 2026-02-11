import { useState } from "react";
import { motion } from "framer-motion";
import PixelAlpaca from "./PixelAlpaca";
import PixelDino from "./PixelDino";
import PixelPanda from "./PixelPanda";

export type CharacterType = "alpaca" | "dino" | "panda";

interface CharacterSelectProps {
  onSelect: (type: CharacterType) => void;
}

const characters: { type: CharacterType; label: string; emoji: string }[] = [
  { type: "alpaca", label: "Alpacas", emoji: "🦙" },
  { type: "dino", label: "Dinos", emoji: "🦕" },
  { type: "panda", label: "Pandas", emoji: "🐼" },
];

const CharacterSelect = ({ onSelect }: CharacterSelectProps) => {
  const [selected, setSelected] = useState<CharacterType | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl text-foreground mb-4 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
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

      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
        {characters.map((char, i) => (
          <motion.button
            key={char.type}
            className={`flex flex-col items-center gap-4 p-6 rounded-xl border-[3px] bg-card/50 transition-colors cursor-pointer ${
              selected === char.type ? "border-primary" : "border-border hover:border-primary"
            }`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(char.type)}
          >
            <div className="flex items-end gap-3">
              {char.type === "alpaca" ? (
                <>
                  <PixelAlpaca color="green" className="scale-75" />
                  <PixelAlpaca color="pink" mirror className="scale-75" />
                </>
              ) : char.type === "dino" ? (
                <>
                  <PixelDino color="green" className="scale-75" />
                  <PixelDino color="pink" mirror className="scale-75" />
                </>
              ) : (
                <>
                  <PixelPanda color="green" className="scale-75" />
                  <PixelPanda color="pink" mirror className="scale-75" />
                </>
              )}
            </div>
            <span className="text-2xl text-foreground">
              {char.emoji} {char.label}
            </span>
          </motion.button>
        ))}
      </div>

      <motion.button
        className="mt-10 w-full max-w-sm py-4 text-2xl rounded-lg text-white font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ backgroundColor: "#E91E8B" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={selected ? { scale: 1.05 } : {}}
        whileTap={selected ? { scale: 0.95 } : {}}
        disabled={!selected}
        onClick={() => selected && onSelect(selected)}
      >
        Create & Share 💝
      </motion.button>
    </div>
  );
};

export default CharacterSelect;
