import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import PixelAlpaca from "./PixelAlpaca";
import PixelDino from "./PixelDino";
import PixelPanda from "./PixelPanda";
import type { CharacterType } from "./CharacterSelect";
import { useValentine } from "@/hooks/useValentine";

interface ShareScreenProps {
  yourName: string;
  theirName: string;
  character: CharacterType;
  loveNote: string;
  valentineId: string;
  onSendAnother: () => void;
  onPreviewAsReceiver: () => void;
}

const ShareScreen = ({
  yourName,
  theirName,
  character,
  loveNote,
  valentineId,
  onSendAnother,
  onPreviewAsReceiver,
}: ShareScreenProps) => {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const { valentine } = useValentine(valentineId);

  const shareUrl = `${window.location.origin}/v/${valentineId}`;

  const CharacterComponent =
    character === "alpaca" ? PixelAlpaca : character === "dino" ? PixelDino : PixelPanda;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Copied! ✓", { duration: 2000 });
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey ${theirName}! Someone has a Valentine question for you 💕 ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${yourName}'s Valentine for ${theirName}`,
          text: `Hey ${theirName}, will you be my Valentine? 💕`,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      <motion.h1
        className="text-3xl sm:text-4xl text-foreground mb-2 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 120 }}
      >
        Your valentine for {theirName} is ready! 💌
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl text-muted-foreground mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Share this link with {theirName} and wait for their answer!
      </motion.p>

      {/* Preview Card */}
      <motion.div
        className="w-full max-w-sm rounded-xl border-2 border-border p-6 flex flex-col items-center gap-4 mb-6 bg-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-end gap-4">
          <CharacterComponent color="green" className="scale-75" />
          <CharacterComponent color="pink" mirror className="scale-75" />
        </div>
        <div className="flex w-full justify-between px-6">
          <span className="text-base text-foreground">{yourName}</span>
          <span className="text-base text-foreground">{theirName}</span>
        </div>
        <p className="text-sm text-muted-foreground">BE MY VALENTINE?</p>
      </motion.div>

      {/* Share Link Box */}
      <motion.div
        className="w-full max-w-sm rounded-lg flex items-center justify-between px-4 py-3 mb-6 bg-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-sm text-muted-foreground truncate mr-3">
          {shareUrl}
        </span>
        <button
          onClick={handleCopy}
          className="text-xl hover:scale-110 active:scale-95 transition-transform shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center"
          title="Copy link"
        >
          📋
        </button>
      </motion.div>

      {/* Share Buttons - stack on mobile */}
      <motion.div
        className="w-full max-w-sm flex flex-col sm:flex-row gap-3 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleWhatsApp}
          className="flex-1 py-3 text-lg rounded-lg border-2 text-foreground transition-all hover:scale-105 active:scale-95 min-h-[48px]"
          style={{ borderColor: "#25D366" }}
        >
          💬 WhatsApp
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 py-3 text-lg rounded-lg border-2 border-border text-foreground transition-all hover:scale-105 active:scale-95 min-h-[48px]"
        >
          📱 {showQR ? "Hide QR" : "Show QR"}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 text-lg rounded-lg border-2 text-foreground transition-all hover:scale-105 active:scale-95 min-h-[48px]"
          style={{ borderColor: "hsl(var(--primary))" }}
        >
          📤 Share
        </button>
      </motion.div>

      {/* QR Code */}
      {showQR && (
        <motion.div
          className="w-48 h-48 rounded-lg mb-6 flex items-center justify-center bg-white p-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 120 }}
        >
          <QRCodeSVG
            value={shareUrl}
            size={160}
            bgColor="transparent"
            fgColor="#E91E8B"
            level="M"
          />
        </motion.div>
      )}

      {/* Status - Realtime Updates */}
      {valentine?.status === 'sent' && (
        <motion.div
          className="flex items-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-lg text-muted-foreground">
            ⏳ Waiting for {theirName} to open...
          </span>
        </motion.div>
      )}

      {valentine?.status === 'opened' && !valentine.receiver_choice && (
        <motion.div
          className="flex flex-col items-center gap-2 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 120 }}
        >
          <span className="text-lg text-foreground">
            👀 {theirName} opened your valentine!
          </span>
          <span className="text-md text-muted-foreground">
            💭 They're deciding...
          </span>
        </motion.div>
      )}

      {valentine?.status === 'complete' && valentine.receiver_choice === 'YES' && (
        <motion.div
          className="flex flex-col items-center gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 120 }}
        >
          <span className="text-2xl text-foreground">
            🎉 {theirName} said YES!
          </span>
          <button
            onClick={() => navigate(`/v/${valentineId}`)}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all min-h-[48px]"
          >
            See the result →
          </button>
        </motion.div>
      )}

      {valentine?.status === 'complete' && valentine.receiver_choice === 'NO' && (
        <motion.div
          className="flex flex-col items-center gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 120 }}
        >
          <span className="text-2xl text-foreground">
            💔 {theirName} said no...
          </span>
          <button
            onClick={() => navigate(`/v/${valentineId}`)}
            className="px-6 py-2 rounded-lg border-2 border-border text-foreground hover:scale-105 active:scale-95 transition-all min-h-[48px]"
          >
            See what happened →
          </button>
        </motion.div>
      )}

      {/* Bottom Actions */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button
          onClick={onSendAnother}
          className="px-8 py-3 text-xl rounded-lg border-[3px] border-primary text-foreground transition-all hover:scale-105 active:scale-95 min-h-[48px]"
        >
          💌 Send Another Valentine
        </button>
        <button
          onClick={onPreviewAsReceiver}
          className="text-sm transition-colors hover:opacity-80 text-muted-foreground min-h-[48px]"
        >
          👀 Preview as Receiver
        </button>
      </motion.div>

      {/* Background hearts - fewer on mobile */}
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
  );
};

export default ShareScreen;
