import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CHARACTER_MAP, APPROACH_DIST, getWordplay } from "@/lib/characters";
import ConfettiHearts from "@/components/ConfettiHearts";
import MatchCertificate from "@/components/MatchCertificate";
import DodgeNoButton from "@/components/DodgeNoButton";
import CountdownOverlay from "@/components/CountdownOverlay";
import IntroSequence from "@/components/IntroSequence";
import SoundToggle from "@/components/SoundToggle";
import PageTransition from "@/components/PageTransition";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useValentine } from "@/hooks/useValentine";
import { useSubmitChoice } from "@/hooks/useSubmitChoice";
import { COUNTER_OFFSET } from "@/hooks/useValentineCount";
import { supabase } from "@/lib/supabase";
import type { CharacterType } from "@/components/CharacterSelect";

type Choice = null | "YES" | "NO";
type Outcome = null | "match" | "mismatch";
type MatchPhase = "approaching" | "pecking" | "celebrating";
type GamePhase = "intro" | "game";

interface GameState {
  yourName: string;
  theirName: string;
  loveNote: string;
  character: CharacterType;
}

const DEFAULT_STATE: GameState = {
  yourName: "Someone",
  theirName: "You",
  loveNote: "",
  character: "llama",
};

const SPRING = { type: "spring" as const, damping: 15, stiffness: 120 };

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sound = useSoundEffects();

  // Load valentine from database
  const { valentine, role, isLoading, error } = useValentine(id!);
  const { submitChoice, isSubmitting } = useSubmitChoice(id!);

  // Game state for receiver view (must be declared unconditionally)
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [rightChoice, setRightChoice] = useState<Choice>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [matchPhase, setMatchPhase] = useState<MatchPhase | null>(null);
  const [noDodgeCount, setNoDodgeCount] = useState(0);
  const [shakeRight, setShakeRight] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [centerY, setCenterY] = useState(-80);
  const [cardNumber, setCardNumber] = useState<number>(0);
  const characterRowRef = useRef<HTMLDivElement>(null);

  // Compute card number (rank + offset) for this valentine
  useEffect(() => {
    if (!valentine) return;
    supabase
      .from('valentines')
      .select('id', { count: 'exact', head: true })
      .lte('created_at', valentine.created_at)
      .then(({ count }) => {
        setCardNumber((count || 0) + COUNTER_OFFSET);
      });
  }, [valentine]);

  // Callbacks and effects for receiver game
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

  // Dynamic viewport centering for kiss animation
  useEffect(() => {
    if (showOutcome && outcome === "match" && characterRowRef.current) {
      requestAnimationFrame(() => {
        const rect = characterRowRef.current!.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        setCenterY(viewportCenter - elementCenter);
      });
    }
  }, [showOutcome, outcome]);

  // Loading state
  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            className="text-4xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            💕
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // Error state
  if (error || !valentine) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          <span className="text-4xl">💔</span>
          <h1 className="text-3xl text-foreground">Not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg border-2 border-border text-foreground hover:scale-105 active:scale-95 transition-all min-h-[48px]"
          >
            Go Home
          </button>
        </div>
      </PageTransition>
    );
  }

  // Extract valentine data and map character type back to singular
  const yourName = valentine.sender_name;
  const theirName = valentine.receiver_name;
  const rawCharacter = valentine.character_type.replace(/s$/, '');
  const character = (rawCharacter === 'dino' ? 'llama' : rawCharacter) as CharacterType;
  const loveNote = valentine.love_note || '';

  // ROLE-BASED RENDERING

  // RECEIVER VIEW - Show game if receiver hasn't chosen yet
  if (role === 'receiver' && !valentine.receiver_choice) {
    if (phase === "intro") {
      return (
        <PageTransition>
          <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
          <IntroSequence character={character} yourName={yourName} loveNote={loveNote} onComplete={handleIntroComplete} />
        </PageTransition>
      );
    }

    const bothChosen = rightChoice !== null;
    const CharacterComponent = CHARACTER_MAP[character];
    const approachDist = APPROACH_DIST[character];
    const celebrating = matchPhase === "celebrating";

    const DODGE_TEXTS = [
      "",
      "Really? 🥺",
      "But look at us... 💕",
      "Pookie please... 🥺",
      "I'll be so sad... 😢",
      "Fine... but you're missing out 💔",
    ];
    const dodgeText = DODGE_TEXTS[Math.min(noDodgeCount, DODGE_TEXTS.length - 1)];

    return (
      <PageTransition>
        <div
          className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden relative"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
          {showCountdown && <CountdownOverlay onComplete={handleCountdownComplete} onTick={sound.playCountdown} />}
          {celebrating && <ConfettiHearts />}

          <AnimatePresence>
            {!showOutcome && (
              <motion.h1
                key="valentine-heading"
                className="text-3xl sm:text-4xl md:text-5xl text-foreground mb-8 sm:mb-12 text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
                transition={SPRING}
              >
                {theirName}, will you be {yourName}'s Valentine?
              </motion.h1>
            )}
          </AnimatePresence>

          <motion.div
            ref={characterRowRef}
            className="flex flex-row items-end justify-center w-full gap-4 sm:gap-12 md:gap-20 relative"
            animate={
              showOutcome && outcome === "match"
                ? { y: centerY, scale: 1.25 }
                : {}
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Left - Sender (Green) */}
            <motion.div
              className="flex flex-col items-center gap-2 sm:gap-4"
              animate={
                showOutcome
                  ? outcome === "match"
                    ? { x: matchPhase === "approaching" ? approachDist : matchPhase === "pecking" ? approachDist + 8 : approachDist - 5 }
                    : { y: 5, rotate: -3 }
                  : {}
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <motion.div
                className="origin-bottom scale-[0.6] sm:scale-100"
                animate={
                  celebrating
                    ? { y: [0, -15, 0], rotate: 0 }
                    : noDodgeCount >= 3
                      ? { y: [0, -8, 0], rotate: -5 }
                      : noDodgeCount >= 1
                        ? { y: [0, -6, 0], rotate: -5 }
                        : { y: [0, -6, 0], rotate: 0 }
                }
                transition={
                  celebrating
                    ? { repeat: Infinity, duration: 0.5 }
                    : noDodgeCount >= 3
                      ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
                      : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                }
              >
                <CharacterComponent color="green" />
              </motion.div>
              {!showOutcome && (
                <div className="flex flex-col items-center gap-0 sm:gap-1">
                  <span className="text-base sm:text-xl text-foreground tracking-wide whitespace-nowrap">{yourName}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground text-center">asked you to be<br className="sm:hidden" /> their valentine 💚</span>
                </div>
              )}
            </motion.div>

            {/* Heart between */}
            <AnimatePresence>
              {celebrating && (
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

            {/* Wordplay text during celebration */}
            <AnimatePresence>
              {celebrating && (
                <motion.p
                  key="wordplay-celebration"
                  className="absolute -bottom-14 text-lg sm:text-2xl text-foreground text-center max-w-[90vw]"
                  style={{ textShadow: "0 0 10px hsl(var(--brand-pink))" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {getWordplay(character, yourName + theirName)}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Right - Receiver (Pink) */}
            <motion.div
              className="flex flex-col items-center gap-2 sm:gap-4"
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
                className="origin-bottom scale-[0.6] sm:scale-100"
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
                <div className="flex flex-col items-center gap-2 sm:gap-2">
                  <span className="text-base sm:text-xl text-foreground tracking-wide whitespace-nowrap">{theirName}</span>
                  <div className="flex gap-2 sm:gap-3 items-center">
                    <motion.div
                      animate={{
                        scale: noDodgeCount >= 5 ? 1.6 : noDodgeCount >= 4 ? 1.4 : noDodgeCount >= 3 ? 1.2 : noDodgeCount >= 2 ? 1.1 : 1,
                        boxShadow: noDodgeCount >= 4
                          ? "0 0 20px hsl(var(--brand-pink)), 0 0 40px hsl(var(--brand-pink))"
                          : "none",
                      }}
                      transition={SPRING}
                      style={{ borderRadius: "0.375rem" }}
                    >
                      <button
                        onClick={async () => {
                          setRightChoice("YES");
                          sound.playDing();
                          await submitChoice('YES');
                        }}
                        disabled={bothChosen || isSubmitting}
                        className="px-4 py-2 text-sm sm:px-7 sm:py-3 sm:text-xl font-hand rounded-md border-[2px] sm:border-[3px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 min-h-[36px] sm:min-h-[48px] whitespace-nowrap"
                        style={{
                          borderColor: "hsl(var(--brand-green))",
                          backgroundColor: rightChoice === "YES" ? "hsl(var(--brand-green))" : "transparent",
                          color: rightChoice === "YES" ? "hsl(var(--background))" : "hsl(var(--foreground))",
                          fontFamily: "'Patrick Hand', cursive",
                        }}
                      >
                        YES 💚
                      </button>
                    </motion.div>
                    <DodgeNoButton
                      color="pink"
                      selected={rightChoice === "NO"}
                      onClick={async () => {
                        setRightChoice("NO");
                        sound.playBloop();
                        await submitChoice('NO');
                      }}
                      disabled={bothChosen || isSubmitting}
                      dodgeCount={noDodgeCount}
                      onDodge={() => {
                        setNoDodgeCount((c) => c + 1);
                        setShakeRight(true);
                        sound.playDodge();
                      }}
                      customStyle={{
                        borderColor: "hsl(var(--muted-foreground))",
                        fontSize: "0.8rem",
                        padding: "0.25rem 0.5rem",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {noDodgeCount > 0 && (
                      <motion.p
                        key={noDodgeCount}
                        className="text-xs sm:text-sm mt-1 text-center"
                        style={{ color: "hsl(var(--brand-pink))", fontFamily: "'Patrick Hand', cursive" }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {dodgeText}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Outcome */}
          <AnimatePresence>
            {showOutcome && (
              outcome === "match" ? (
                <MatchCertificate
                  yourName={yourName}
                  theirName={theirName}
                  character={character}
                  cardNumber={cardNumber}
                  onSendBack={() => navigate(`/create?from=${encodeURIComponent(theirName)}&to=${encodeURIComponent(yourName)}`, { replace: true })}
                />
              ) : (
                <motion.div
                  className="mt-10 flex flex-col items-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.p
                    className="text-3xl sm:text-4xl text-foreground text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    That's otterly unfortunate... 🦦💔
                  </motion.p>
                  <motion.div
                    className="text-4xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, ...SPRING }}
                  >
                    💔
                  </motion.div>
                  <motion.p
                    className="text-xl text-muted-foreground text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    But there are plenty of fish in the sea 🦦
                  </motion.p>
                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 items-center"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                  >
                    <button
                      onClick={() => navigate(`/create?from=${encodeURIComponent(theirName)}&to=${encodeURIComponent(yourName)}`, { replace: true })}
                      className="px-7 py-3 text-lg rounded-lg border-[3px] text-foreground transition-all hover:scale-105 active:scale-95 min-h-[48px]"
                      style={{ borderColor: "hsl(var(--primary))" }}
                    >
                      💌 Send {yourName} a Valentine Instead
                    </button>
                    <button
                      onClick={() => navigate("/create", { replace: true })}
                      className="px-7 py-3 text-lg rounded-lg border-[3px] text-foreground transition-all hover:scale-105 active:scale-95 min-h-[48px]"
                      style={{ borderColor: "hsl(var(--muted-foreground))" }}
                    >
                      Don't be shellfish — send your own! 💌
                    </button>
                  </motion.div>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* Floating hearts - fewer on mobile */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute text-2xl opacity-20 ${i >= 4 ? "hidden sm:block" : ""}`}
                style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.7, ease: "easeInOut" }}
              >
                💕
              </motion.div>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  // RECEIVER VIEW - Already chose, show outcome
  if (role === 'receiver' && valentine.receiver_choice) {
    const CharacterComponent = CHARACTER_MAP[character];
    const didMatch = valentine.receiver_choice === 'YES';

    return (
      <PageTransition>
        <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          {didMatch ? (
            <>
              <ConfettiHearts />
              <MatchCertificate
                yourName={yourName}
                theirName={theirName}
                character={character}
                cardNumber={cardNumber}
                onSendBack={() => navigate(`/create?from=${encodeURIComponent(theirName)}&to=${encodeURIComponent(yourName)}`, { replace: true })}
              />
            </>
          ) : (
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.p className="text-3xl sm:text-4xl text-foreground text-center">
                You said no 💔
              </motion.p>
              <motion.div className="text-4xl">💔</motion.div>
              <button
                onClick={() => navigate(`/create?from=${encodeURIComponent(theirName)}&to=${encodeURIComponent(yourName)}`)}
                className="px-6 py-3 rounded-lg border-2 border-primary text-foreground hover:scale-105 active:scale-95 transition-all min-h-[48px]"
              >
                💌 Send {yourName} a Valentine
              </button>
            </motion.div>
          )}
        </div>
      </PageTransition>
    );
  }

  // SENDER VIEW - Watching status
  if (role === 'sender') {
    const CharacterComponent = CHARACTER_MAP[character];

    return (
      <PageTransition>
        <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          <motion.h1
            className="text-3xl sm:text-4xl text-foreground text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your Valentine for {theirName}
          </motion.h1>

          <div className="flex items-end gap-8">
            <CharacterComponent color="green" />
            <CharacterComponent color="pink" mirror />
          </div>

          {valentine.status === 'sent' && (
            <motion.div
              className="text-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <p className="text-xl text-muted-foreground">Waiting for your otter half to respond... 🦦</p>
            </motion.div>
          )}

          {valentine.status === 'opened' && !valentine.receiver_choice && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-xl text-foreground">👀 {theirName} opened it!</p>
              <p className="text-lg text-muted-foreground">💭 They're deciding...</p>
            </motion.div>
          )}

          {valentine.status === 'complete' && valentine.receiver_choice === 'YES' && (
            <motion.div
              className="text-center flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ConfettiHearts />
              <p className="text-3xl text-foreground">🎉 {theirName} said YES!</p>
              <MatchCertificate
                yourName={yourName}
                theirName={theirName}
                character={character}
                cardNumber={cardNumber}
                onSendBack={() => navigate("/create")}
              />
            </motion.div>
          )}

          {valentine.status === 'complete' && valentine.receiver_choice === 'NO' && (
            <motion.div
              className="text-center flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-2xl text-foreground">💔 {theirName} said no...</p>
              <p className="text-lg text-muted-foreground">That's otterly unfortunate... 🦦</p>
              <button
                onClick={() => navigate("/create")}
                className="px-6 py-3 rounded-lg border-2 border-border text-foreground hover:scale-105 active:scale-95 transition-all min-h-[48px]"
              >
                Send another? You otter do it! 💌
              </button>
            </motion.div>
          )}
        </div>
      </PageTransition>
    );
  }

  // STRANGER VIEW
  if (role === 'stranger') {
    const CharacterComponent = CHARACTER_MAP[character];

    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          {valentine.status === 'complete' ? (
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1 className="text-3xl text-foreground text-center">
                {valentine.receiver_choice === 'YES' ? '💕 Otterly in Love!' : '💔 Not Meant to Be'}
              </h1>
              <div className="flex items-end gap-8">
                <div className="flex flex-col items-center gap-2">
                  <CharacterComponent color="green" />
                  <span className="text-lg">{yourName}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CharacterComponent color="pink" mirror />
                  <span className="text-lg">{theirName}</span>
                </div>
              </div>
              <p className="text-xl text-muted-foreground text-center">
                {valentine.receiver_choice === 'YES'
                  ? `${yourName} and ${theirName} are a match! 💕`
                  : `${theirName} said no to ${yourName}`
                }
              </p>
              <button
                onClick={() => navigate("/create")}
                className="px-6 py-3 rounded-lg border-2 border-primary text-foreground hover:scale-105 active:scale-95 transition-all min-h-[48px]"
              >
                Don't be shellfish — send your own! 💌
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-4xl">💌</span>
              <h1 className="text-2xl text-foreground text-center">
                This valentine is for someone special
              </h1>
              <p className="text-lg text-muted-foreground text-center max-w-md">
                This is a private valentine between {yourName} and {theirName}.
              </p>
              <button
                onClick={() => navigate("/create")}
                className="px-6 py-3 rounded-lg border-2 border-primary text-foreground hover:scale-105 active:scale-95 transition-all min-h-[48px]"
              >
                Don't be shellfish — send your own! 💌
              </button>
            </motion.div>
          )}
        </div>
      </PageTransition>
    );
  }

  // Fallback (should never reach here)
  return null;
};

export default GamePage;
