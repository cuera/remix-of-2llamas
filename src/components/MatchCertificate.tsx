import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Instagram } from "lucide-react"; // Import Instagram icon
import { CHARACTER_MAP } from "@/lib/characters";
import type { CharacterType } from "./CharacterSelect";

interface MatchCertificateProps {
  yourName: string;
  theirName: string;
  character: CharacterType;
  onSendBack: () => void;
}

const MatchCertificate = ({
  yourName,
  theirName,
  character,
  onSendBack,
}: MatchCertificateProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const CharacterComponent = CHARACTER_MAP[character];

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "hsl(270, 40%, 17%)", // Match app background for seamless corners if any
      });
      const link = document.createElement("a");
      link.download = `otterly-${yourName}-${theirName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
    }
  }, [yourName, theirName]);

  const handleShareResult = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "hsl(270, 40%, 17%)",
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `otterly-${yourName}-${theirName}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          text: `${yourName} & ${theirName} are Otterly in Love! 🦦💕 Check it out: https://otterlyinlove.info`,
          files: [file],
        });
      } else {
        const text = encodeURIComponent(
          `${yourName} & ${theirName} are Otterly in Love! 🦦💕 Check it out: https://otterlyinlove.info`
        );
        window.open(`https://wa.me/?text=${text}`, "_blank");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        handleDownload();
      }
    }
  }, [yourName, theirName, handleDownload]);

  const buttonBase =
    "px-6 py-3 text-lg font-bold rounded-xl border-[3px] transition-all hover:scale-105 active:scale-95 min-h-[52px] flex items-center justify-center gap-2 shadow-sm";

  return (
    <motion.div
      className="flex flex-col items-center w-full px-4 relative z-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.8, type: "spring", bounce: 0.4 }}
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      {/* 4:5 Premium Card */}
      <div
        ref={cardRef}
        className="relative flex flex-col items-center bg-white aspect-[4/5] w-full max-w-[340px] sm:max-w-[400px] shadow-2xl"
        style={{
          borderRadius: "20px",
          padding: "24px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 20px 60px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2) inset",
        }}
      >
        {/* Holographic/Glossy Overlay Effect (Subtle) */}
        <div
          className="absolute inset-0 rounded-[20px] pointer-events-none opacity-30"
          style={{
            background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
        />

        {/* 2026 Sticker Badge - Upper Right */}
        <div
          className="absolute top-4 right-4 z-20 flex items-center justify-center"
          style={{
            width: "56px",
            height: "56px",
            background: "#FFD700", // Gold/Yellow
            borderRadius: "50%",
            transform: "rotate(12deg)",
            boxShadow: "2px 4px 10px rgba(0,0,0,0.15)",
            border: "2px solid #fff",
          }}
        >
          <span className="text-xl font-bold text-black tracking-tighter" style={{ fontFamily: "monospace" }}>2026</span>
        </div>

        {/* Header Content */}
        <div className="w-full flex flex-col items-center mb-4 mt-2">
          <h2
            className="text-2xl sm:text-3xl font-black tracking-wider text-center leading-none mb-1"
            style={{ color: "hsl(var(--brand-pink))" }}
          >
            OTTERLY IN LOVE 🦦
          </h2>
          <p className="text-[10px] sm:text-xs font-mono text-gray-400 tracking-[0.2em] uppercase">
            VALENTINE'S DROP — 2026
          </p>
        </div>

        {/* Inner Dark Frame for Characters */}
        <div
          className="w-full flex-1 flex flex-col items-center justify-center relative overflow-hidden mb-4"
          style={{
            background: "linear-gradient(180deg, #2D1B4E 0%, #1a102e 100%)",
            borderRadius: "16px",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
            border: "4px solid #fff",
          }}
        >
          {/* Animated Background Elements inside frame */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white text-opacity-30"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                  fontSize: `${Math.random() * 10 + 10}px`
                }}
              >
                ✨
              </div>
            ))}
          </div>

          <div className="flex items-end gap-4 z-10 scale-110 sm:scale-125 mb-4">
            <motion.div
              animate={{ y: [0, -5, 0], rotate: -3 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <CharacterComponent color="green" />
            </motion.div>
            <motion.div
              className="text-4xl"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ❤️
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0], rotate: 3 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
            >
              <CharacterComponent color="pink" mirror />
            </motion.div>
          </div>

          <p
            className="text-2xl font-bold tracking-wide z-10"
            style={{
              color: "#fff",
              textShadow: "0 0 10px #ff69b4, 0 0 20px #ff69b4",
            }}
          >
            It's a match!
          </p>
        </div>

        {/* Footer Names */}
        <div className="w-full text-center mb-6">
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">
            {yourName} <span className="text-red-500">❤️</span> {theirName}
          </p>
        </div>

        {/* Card Footer: URL & IG */}
        <div className="w-full flex items-center justify-between px-2 mt-auto pt-4 border-t-2 border-dashed border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Instagram className="w-4 h-4" />
            <span className="text-xs font-mono font-bold tracking-wider">otterlyinlove.info</span>
          </div>
          <div className="text-xs font-mono text-gray-300">
            #001
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-3 w-full max-w-[340px] mt-[-24px] z-30">
        {/* Main CTA - Tilted & Overlapping */}
        <motion.button
          onClick={handleShareResult}
          className={`${buttonBase} w-full text-white transform -rotate-2 relative overflow-hidden`}
          style={{
            background: "linear-gradient(90deg, #FF1493 0%, #FF69B4 100%)",
            borderColor: "#fff",
            boxShadow: "0 10px 25px -5px rgba(255, 20, 147, 0.5)",
          }}
          whileHover={{ scale: 1.02, rotate: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
          <Instagram className="w-5 h-5" />
          <span>Share Our Match!</span>
        </motion.button>

        {/* Secondary Actions */}
        <div className="flex gap-3 w-full mt-2">
          <motion.button
            onClick={onSendBack}
            className={`${buttonBase} flex-1 text-sm sm:text-base border-gray-300 bg-white/90 backdrop-blur text-gray-700 hover:bg-white`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            💌 Reply
          </motion.button>

          <motion.button
            onClick={handleDownload}
            className={`${buttonBase} flex-1 text-sm sm:text-base border-gray-300 bg-white/90 backdrop-blur text-gray-700 hover:bg-white`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📸 Save
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCertificate;
