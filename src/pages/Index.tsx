import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PixelAlpaca from "@/components/PixelAlpaca";
import PixelDino from "@/components/PixelDino";
import ChoiceButton from "@/components/ChoiceButton";
import ConfettiHearts from "@/components/ConfettiHearts";
import CharacterSelect, { type CharacterType } from "@/components/CharacterSelect";

type Choice = null | "YES" | "NO";
type Outcome = null | "match" | "no-match" | "mismatch";

const Index = () => {
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [leftChoice, setLeftChoice] = useState<Choice>(null);
  const [rightChoice, setRightChoice] = useState<Choice>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [showOutcome, setShowOutcome] = useState(false);

  useEffect(() => {
    if (leftChoice && rightChoice) {
      const timer = setTimeout(() => {
        if (leftChoice === "YES" && rightChoice === "YES") setOutcome("match");
        else if (leftChoice === "NO" && rightChoice === "NO") setOutcome("no-match");
        else setOutcome("mismatch");
        setShowOutcome(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [leftChoice, rightChoice]);

  const reset = () => {
    setLeftChoice(null);
    setRightChoice(null);
    setOutcome(null);
    setShowOutcome(false);
  };

  const backToSelect = () => {
    reset();
    setCharacter(null);
  };

  if (!character) {
    return <CharacterSelect onSelect={setCharacter} />;
  }

  const bothChosen = leftChoice !== null && rightChoice !== null;
  const leftSaidYes = leftChoice === "YES";

  const CharacterComponent = character === "alpaca" ? PixelAlpaca : PixelDino;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden relative"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      {outcome === "match" && <ConfettiHearts />}

      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl text-foreground mb-8 sm:mb-12 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        BE MY VALENTINE?
      </motion.h1>

      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 sm:gap-12 md:gap-20">
        {/* Left side - Green character ("ME") */}
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={
            showOutcome
              ? outcome === "match"
                ? { x: 40 }
                : outcome === "no-match"
                ? { x: -300, opacity: 0 }
                : leftSaidYes
                ? {}
                : { x: -300, opacity: 0 }
              : {}
          }
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            animate={
              outcome === "match" ? { y: [0, -15, 0] } : {}
            }
            transition={
              outcome === "match"
                ? { repeat: Infinity, duration: 0.5 }
                : {}
            }
          >
            <CharacterComponent
              color="green"
              confused={outcome === "mismatch" && leftSaidYes}
            />
          </motion.div>
          {!showOutcome && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xl text-foreground tracking-wide">ME</span>
              <div className="flex gap-3">
                <ChoiceButton label="NO" color="green" selected={leftChoice === "NO"} onClick={() => setLeftChoice("NO")} disabled={bothChosen} />
                <ChoiceButton label="YES" color="green" selected={leftChoice === "YES"} onClick={() => setLeftChoice("YES")} disabled={bothChosen} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Heart between characters */}
        <AnimatePresence>
          {outcome === "match" && showOutcome && (
            <motion.div
              className="text-5xl sm:text-6xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ❤️
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right side - Pink character ("YOU") */}
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={
            showOutcome
              ? outcome === "match"
                ? { x: -40 }
                : outcome === "no-match"
                ? { x: 300, opacity: 0 }
                : !leftSaidYes
                ? {}
                : { x: 300, opacity: 0 }
              : {}
          }
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            animate={
              outcome === "match" ? { y: [0, -15, 0] } : {}
            }
            transition={
              outcome === "match"
                ? { repeat: Infinity, duration: 0.5, delay: 0.25 }
                : {}
            }
          >
            <CharacterComponent
              color="pink"
              mirror
              confused={outcome === "mismatch" && !leftSaidYes}
            />
          </motion.div>
          {!showOutcome && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xl text-foreground tracking-wide">YOU</span>
              <div className="flex gap-3">
                <ChoiceButton label="YES" color="pink" selected={rightChoice === "YES"} onClick={() => setRightChoice("YES")} disabled={bothChosen} />
                <ChoiceButton label="NO" color="pink" selected={rightChoice === "NO"} onClick={() => setRightChoice("NO")} disabled={bothChosen} />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Outcome message */}
      <AnimatePresence>
        {showOutcome && (
          <motion.div
            className="mt-10 flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-3xl sm:text-4xl text-foreground text-center">
              {outcome === "match" && "It's a match! ❤️"}
              {outcome === "no-match" && "Maybe next time... 💔"}
              {outcome === "mismatch" && "Awkward... 😅"}
            </p>
            <div className="flex gap-4">
              <button
                onClick={reset}
                className="px-8 py-3 text-xl rounded-lg border-[3px] text-foreground transition-all hover:scale-105 active:scale-95"
                style={{ borderColor: "hsl(var(--primary))" }}
              >
                Play Again 🔄
              </button>
              <button
                onClick={backToSelect}
                className="px-8 py-3 text-xl rounded-lg border-[3px] text-foreground transition-all hover:scale-105 active:scale-95"
                style={{ borderColor: "hsl(var(--accent))" }}
              >
                Switch Characters 🔀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3 + i * 0.5,
              delay: i * 0.7,
              ease: "easeInOut",
            }}
          >
            💕
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Index;
