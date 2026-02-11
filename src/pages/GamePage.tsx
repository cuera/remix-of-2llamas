import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelAlpaca from "@/components/PixelAlpaca";
import PixelDino from "@/components/PixelDino";
import PixelPanda from "@/components/PixelPanda";
import ChoiceButton from "@/components/ChoiceButton";
import ConfettiHearts from "@/components/ConfettiHearts";
import MatchCertificate from "@/components/MatchCertificate";
import DodgeNoButton from "@/components/DodgeNoButton";
import CountdownOverlay from "@/components/CountdownOverlay";
import IntroSequence from "@/components/IntroSequence";
import SoundToggle from "@/components/SoundToggle";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import type { CharacterType } from "@/components/CharacterSelect";

type Choice = null | "YES" | "NO";
type Outcome = null | "match" | "no-match" | "mismatch";
type MatchPhase = "approaching" | "pecking" | "celebrating";
type GamePhase = "intro" | "game";

interface GameState {
  yourName: string;
  theirName: string;
  loveNote: string;
  character: CharacterType;
}

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as GameState | null;
  const sound = useSoundEffects();

  const [phase, setPhase] = useState<GamePhase>("intro");
  const [rightChoice, setRightChoice] = useState<Choice>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [matchPhase, setMatchPhase] = useState<MatchPhase | null>(null);
  const [noDodgeCount, setNoDodgeCount] = useState(0);
  const [shakeRight, setShakeRight] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  const handleIntroComplete = useCallback(() => {
    setPhase("game");
    sound.playBloop();
  }, [sound]);

  useEffect(() => {
    if (rightChoice) {
      const timer = setTimeout(() => setShowCountdown(true), 400);
      return () => clearTimeout(timer);
    }
  }, [rightChoice]);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    if (rightChoice === "YES") {
      setOutcome("match");
      sound.playCelebration();
    } else {
      setOutcome("mismatch");
      sound.playWahWah();
    }
    setShowOutcome(true);
  };

  useEffect(() => {
    if (outcome !== "match") {
      setMatchPhase(null);
      return;
    }
    setMatchPhase("approaching");
    const peckTimer = setTimeout(() => setMatchPhase("pecking"), 900);
    const celebrateTimer = setTimeout(() => setMatchPhase("celebrating"), 1500);
    return () => {
      clearTimeout(peckTimer);
      clearTimeout(celebrateTimer);
    };
  }, [outcome]);

  const resetGame = () => {
    setRightChoice(null);
    setOutcome(null);
    setShowOutcome(false);
    setMatchPhase(null);
    setNoDodgeCount(0);
    setShakeRight(false);
    setShowCountdown(false);
    if (state) {
      navigate("/share", { state, replace: true });
    }
  };

  const backToSelect = () => {
    navigate("/create", { replace: true });
  };

  if (!state) return null;

  const { yourName, theirName, character } = state;

  if (phase === "intro") {
    return (
      <>
        <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
        <IntroSequence character={character} yourName={yourName} onComplete={handleIntroComplete} />
      </>
    );
  }

  const bothChosen = rightChoice !== null;
  const CharacterComponent = character === "alpaca" ? PixelAlpaca : character === "dino" ? PixelDino : PixelPanda;
  const approachDist = character === "alpaca" ? 55 : character === "dino" ? 48 : 55;
  const celebrating = matchPhase === "celebrating";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden relative"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
      {showCountdown && <CountdownOverlay onComplete={handleCountdownComplete} onTick={sound.playCountdown} />}
      {matchPhase === "celebrating" && <ConfettiHearts />}

      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl text-foreground mb-8 sm:mb-12 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {theirName}, will you be {yourName}'s Valentine?
      </motion.h1>

      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 sm:gap-12 md:gap-20">
        {/* Left side - Sender (Green) */}
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={
            showOutcome
              ? outcome === "match"
                ? { x: matchPhase === "approaching" ? approachDist : matchPhase === "pecking" ? approachDist + 8 : approachDist - 5 }
                : { x: -300, opacity: 0 }
              : {}
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            animate={celebrating ? { y: [0, -15, 0] } : {}}
            transition={celebrating ? { repeat: Infinity, duration: 0.5 } : {}}
          >
            <CharacterComponent color="green" />
          </motion.div>
          {!showOutcome && (
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl text-foreground tracking-wide">{yourName}</span>
              <span className="text-sm text-muted-foreground">asked you to be their valentine 💚</span>
            </div>
          )}
        </motion.div>

        {/* Heart between characters */}
        <AnimatePresence>
          {matchPhase === "celebrating" && (
            <motion.div
              className="text-5xl sm:text-6xl absolute"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.3, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ zIndex: 10 }}
            >
              ❤️
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right side - Receiver (Pink) */}
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={
            showOutcome
              ? outcome === "match"
                ? { x: matchPhase === "approaching" ? -approachDist : matchPhase === "pecking" ? -(approachDist + 8) : -(approachDist - 5) }
                : rightChoice === "NO"
                ? { x: 300, opacity: 0 }
                : {}
              : {}
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            animate={
              celebrating
                ? { y: [0, -15, 0] }
                : shakeRight
                ? { rotate: [0, -5, 5, -3, 3, 0] }
                : {}
            }
            transition={
              celebrating
                ? { repeat: Infinity, duration: 0.5, delay: 0.25 }
                : shakeRight
                ? { duration: 0.4 }
                : {}
            }
            onAnimationComplete={() => setShakeRight(false)}
          >
            <CharacterComponent color="pink" mirror confused={outcome === "mismatch"} />
          </motion.div>
          {!showOutcome && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xl text-foreground tracking-wide">{theirName}</span>
              <div className="flex gap-3 items-center">
                <motion.div
                  animate={{
                    scale: noDodgeCount >= 5 ? 2 : noDodgeCount >= 4 ? 1.5 : noDodgeCount >= 3 ? 1.2 : 1,
                    boxShadow: noDodgeCount >= 4
                      ? "0 0 20px hsl(var(--alpaca-pink)), 0 0 40px hsl(var(--alpaca-pink))"
                      : "none",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ borderRadius: "0.375rem" }}
                >
                  <ChoiceButton
                    label="YES"
                    color="pink"
                    selected={rightChoice === "YES"}
                    onClick={() => { setRightChoice("YES"); sound.playDing(); }}
                    disabled={bothChosen}
                  />
                </motion.div>
                <DodgeNoButton
                  color="pink"
                  selected={rightChoice === "NO"}
                  onClick={() => { setRightChoice("NO"); sound.playBloop(); }}
                  disabled={bothChosen}
                  dodgeCount={noDodgeCount}
                  onDodge={() => {
                    setNoDodgeCount((c) => c + 1);
                    setShakeRight(true);
                    sound.playDodge();
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Outcome */}
      <AnimatePresence>
        {showOutcome && (
          outcome === "match" ? (
            <MatchCertificate
              yourName={yourName}
              theirName={theirName}
              character={character}
              onPlayAgain={resetGame}
              onSwitchCharacters={backToSelect}
            />
          ) : (
            <motion.div
              className="mt-10 flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-3xl sm:text-4xl text-foreground text-center">Awkward... 😅</p>
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="px-8 py-3 text-xl rounded-lg border-[3px] text-foreground transition-all hover:scale-105 active:scale-95"
                  style={{ borderColor: "hsl(var(--primary))" }}
                >
                  Try Again 🔄
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
          )
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
            transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.7, ease: "easeInOut" }}
          >
            💕
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
