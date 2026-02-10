import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PixelAlpaca from "./PixelAlpaca";
import PixelDino from "./PixelDino";
import PixelPanda from "./PixelPanda";
import type { CharacterType } from "./CharacterSelect";

interface IntroSequenceProps {
  character: CharacterType;
  yourName: string;
  onComplete: () => void;
}

const IntroSequence = ({ character, yourName, onComplete }: IntroSequenceProps) => {
  const [phase, setPhase] = useState(0);
  // 0: characters slide in from sides
  // 1: green pulls out heart
  // 2: text types out letter by letter
  // 3: done -> onComplete

  const CharacterComponent =
    character === "alpaca" ? PixelAlpaca : character === "dino" ? PixelDino : PixelPanda;

  const fullText = "BE MY VALENTINE?";
  const [typedIndex, setTypedIndex] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 2200 + fullText.length * 120 + 800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Typing effect
  useEffect(() => {
    if (phase < 2) return;
    if (typedIndex >= fullText.length) return;
    const timer = setTimeout(() => setTypedIndex((i) => i + 1), 100);
    return () => clearTimeout(timer);
  }, [phase, typedIndex]);

  useEffect(() => {
    if (phase === 3) onComplete();
  }, [phase, onComplete]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      <div className="flex items-end gap-6 sm:gap-16 mb-8 relative">
        {/* Green character walks in from left */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            animate={phase >= 1 ? { y: [0, -5, 0] } : {}}
            transition={{ repeat: phase >= 1 ? 2 : 0, duration: 0.3 }}
          >
            <CharacterComponent color="green" />
          </motion.div>
        </motion.div>

        {/* Pixel heart appears between them */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              className="text-3xl sm:text-4xl absolute left-1/2 -translate-x-1/2 bottom-full mb-2"
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              💝
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pink character walks in from right */}
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <CharacterComponent color="pink" mirror />
        </motion.div>
      </div>

      {/* Typed-out text */}
      {phase >= 2 && (
        <motion.div
          className="text-3xl sm:text-4xl md:text-5xl text-foreground text-center tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>{fullText.slice(0, typedIndex)}</span>
          <motion.span
            className="inline-block w-[3px] h-[1em] bg-foreground ml-1 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default IntroSequence;
