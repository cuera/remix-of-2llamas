import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PixelAlpaca from "./PixelAlpaca";
import PixelDino from "./PixelDino";
import PixelPanda from "./PixelPanda";
import type { CharacterType } from "./CharacterSelect";

interface IntroSequenceProps {
  character: CharacterType;
  yourName: string;
  loveNote?: string;
  onComplete: () => void;
}

const IntroSequence = ({ character, yourName, loveNote, onComplete }: IntroSequenceProps) => {
  const [scene, setScene] = useState(0);
  const [typedIndex, setTypedIndex] = useState(0);

  const CharacterComponent =
    character === "alpaca" ? PixelAlpaca : character === "dino" ? PixelDino : PixelPanda;

  const hasNote = !!loveNote && loveNote.trim().length > 0;

  // Scene timeline
  useEffect(() => {
    const noteTime = hasNote ? loveNote!.length * 40 + 400 : 0;
    const timers = [
      setTimeout(() => setScene(1), 2000),          // Scene 2 at 2s
      setTimeout(() => setScene(2), 4000),           // Scene 3 at 4s (love note)
      setTimeout(() => setScene(3), 4000 + (hasNote ? noteTime : 200)), // Scene 4
      setTimeout(() => onComplete(), 5000 + (hasNote ? noteTime : 200) + 1000), // End
    ];
    return () => timers.forEach(clearTimeout);
  }, [hasNote, loveNote, onComplete]);

  // Typewriter effect for love note
  useEffect(() => {
    if (scene !== 2 || !hasNote) return;
    if (typedIndex >= loveNote!.length) return;
    const timer = setTimeout(() => setTypedIndex((i) => i + 1), 40);
    return () => clearTimeout(timer);
  }, [scene, typedIndex, hasNote, loveNote]);

  const skip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden z-50"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      {/* Background transition */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: scene >= 1 ? "#2D1B3D" : "#0a0a0f",
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Skip button */}
      <button
        onClick={skip}
        className="absolute bottom-6 right-6 text-sm z-50 transition-opacity hover:opacity-80"
        style={{ color: "#6B7280", fontFamily: "'Patrick Hand', cursive" }}
      >
        Skip ›
      </button>

      {/* Scene 1: Mystery text */}
      <AnimatePresence>
        {scene === 0 && (
          <motion.p
            className="absolute text-center px-4"
            style={{ color: "#ffffff", fontSize: "1.5rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            Someone has a question for you...
          </motion.p>
        )}
      </AnimatePresence>

      {/* Scene 2+: Character walks in */}
      <AnimatePresence>
        {scene >= 1 && (
          <motion.div
            className="absolute flex flex-col items-center"
            style={{ top: "35%" }}
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Bouncing walk */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
            >
              <CharacterComponent color="green" />
            </motion.div>

            {/* Sender name */}
            <motion.span
              className="mt-3 text-xl tracking-wide"
              style={{ color: "#ffffff" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {yourName}
            </motion.span>

            {/* Scene 3: Love note typewriter */}
            <AnimatePresence>
              {scene >= 2 && hasNote && (
                <motion.p
                  className="mt-4 text-center max-w-xs px-4"
                  style={{
                    color: "#F5A9B8",
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  "{loveNote!.slice(0, typedIndex)}"
                  <motion.span
                    className="inline-block w-[2px] h-[1em] ml-0.5 align-middle"
                    style={{ backgroundColor: "#F5A9B8" }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  />
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 4: BE MY VALENTINE? */}
      <AnimatePresence>
        {scene >= 3 && (
          <motion.h1
            className="absolute text-4xl sm:text-5xl md:text-6xl font-bold text-center px-4"
            style={{ color: "#ffffff", bottom: "18%" }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
          >
            BE MY VALENTINE?
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroSequence;
