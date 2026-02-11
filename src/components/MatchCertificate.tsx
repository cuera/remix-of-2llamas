import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import PixelAlpaca from "./PixelAlpaca";
import PixelDino from "./PixelDino";
import PixelPanda from "./PixelPanda";
import type { CharacterType } from "./CharacterSelect";

interface MatchCertificateProps {
  yourName: string;
  theirName: string;
  character: CharacterType;
  onSwitchCharacters: () => void;
}

const MatchCertificate = ({
  yourName,
  theirName,
  character,
  onSwitchCharacters,
}: MatchCertificateProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const CharacterComponent =
    character === "alpaca"
      ? PixelAlpaca
      : character === "dino"
      ? PixelDino
      : PixelPanda;

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#1a0a1e",
      });
      const link = document.createElement("a");
      link.download = `valentine-${yourName}-${theirName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
    }
  }, [yourName, theirName]);

  const buttonBase =
    "px-7 py-3 text-lg rounded-lg border-[3px] text-foreground transition-all hover:scale-105 active:scale-95";

  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      {/* Polaroid Card */}
      <div
        ref={cardRef}
        className="relative flex flex-col items-center"
        style={{
          background: "linear-gradient(145deg, #fdf6f0 0%, #fff0f5 50%, #fce4ec 100%)",
          borderRadius: "6px",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)",
          maxWidth: 380,
          width: "100%",
          transform: "rotate(-1.5deg)",
          padding: "32px 32px 28px",
        }}
      >
        {/* Tape */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          style={{
            width: 60,
            height: 20,
            background: "rgba(255,255,200,0.5)",
            borderRadius: "2px",
            transform: "rotate(2deg)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />

        {/* Inner photo area */}
        <div
          className="w-full flex flex-col items-center gap-3 py-6 px-4 mb-5"
          style={{
            background: "linear-gradient(180deg, hsl(276 45% 22%) 0%, hsl(276 40% 18%) 100%)",
            borderRadius: "3px",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex items-end gap-2">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              <CharacterComponent color="green" />
            </motion.div>
            <motion.div
              className="text-3xl sm:text-4xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              ❤️
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
            >
              <CharacterComponent color="pink" mirror />
            </motion.div>
          </div>

          <p
            className="text-2xl sm:text-3xl font-bold tracking-wide"
            style={{
              color: "hsl(330, 80%, 70%)",
              textShadow: "0 0 20px hsla(330, 80%, 65%, 0.5)",
            }}
          >
            It's a match!
          </p>
        </div>

        {/* Names */}
        <p
          className="text-2xl sm:text-3xl text-center font-bold tracking-wide"
          style={{ color: "hsl(330, 80%, 65%)" }}
        >
          {yourName} ❤️ {theirName}
        </p>

        {/* Date */}
        <p
          className="text-base sm:text-lg mt-1 tracking-widest uppercase"
          style={{ color: "hsl(276, 20%, 50%)", letterSpacing: "0.15em" }}
        >
          Valentine's Day 2026
        </p>

        <p
          className="mt-3 text-xs tracking-wider"
          style={{ color: "hsl(276, 15%, 62%)", letterSpacing: "0.1em" }}
        >
          valentine-alpaca.lovable.app
        </p>

        <span className="absolute top-3 left-3 text-sm opacity-30">💕</span>
        <span className="absolute top-3 right-3 text-sm opacity-30">💕</span>
        <span className="absolute bottom-3 left-3 text-sm opacity-30">💕</span>
        <span className="absolute bottom-3 right-3 text-sm opacity-30">💕</span>
      </div>

      {/* Staggered buttons */}
      <div className="flex flex-col items-center gap-3 mt-2">
        <motion.button
          onClick={handleDownload}
          className={buttonBase}
          style={{ borderColor: "#E91E8B" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📸 Download Card
        </motion.button>

        <motion.button
          onClick={() => navigate("/create", { replace: true })}
          className={buttonBase}
          style={{ borderColor: "#4ADE80" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💌 Send Your Own Valentine
        </motion.button>

        <motion.button
          onClick={onSwitchCharacters}
          className={buttonBase}
          style={{ borderColor: "hsl(var(--muted-foreground))" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔀 Switch Characters
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MatchCertificate;
