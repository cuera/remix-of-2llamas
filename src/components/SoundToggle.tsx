import { motion } from "framer-motion";

interface SoundToggleProps {
  muted: boolean;
  onToggle: () => void;
}

const SoundToggle = ({ muted, onToggle }: SoundToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 right-4 z-40 w-10 h-10 flex items-center justify-center rounded-full border-2 border-border bg-card/80 backdrop-blur-sm text-lg cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? "🔇" : "🔊"}
    </motion.button>
  );
};

export default SoundToggle;
