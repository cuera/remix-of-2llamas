import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PixelAlpaca from "@/components/PixelAlpaca";
import PixelDino from "@/components/PixelDino";
import PixelPanda from "@/components/PixelPanda";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      {/* Title */}
      <motion.h1
        className="text-5xl sm:text-6xl text-foreground mb-8 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Valentine Alpaca 💌
      </motion.h1>

      {/* Character previews */}
      <motion.div
        className="flex items-end gap-6 sm:gap-10 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-end gap-2">
          <PixelAlpaca color="green" className="scale-50 sm:scale-75" />
          <PixelAlpaca color="pink" mirror className="scale-50 sm:scale-75" />
        </div>
        <div className="flex items-end gap-2">
          <PixelDino color="green" className="scale-50 sm:scale-75" />
          <PixelDino color="pink" mirror className="scale-50 sm:scale-75" />
        </div>
        <div className="flex items-end gap-2">
          <PixelPanda color="green" className="scale-50 sm:scale-75" />
          <PixelPanda color="pink" mirror className="scale-50 sm:scale-75" />
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-xl sm:text-2xl mb-10 text-center"
        style={{ color: "#F5A9B8" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        Send a pixel valentine to someone special 💕
      </motion.p>

      {/* CTA Button */}
      <motion.button
        className="px-10 py-4 text-2xl rounded-xl text-white font-bold transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#E91E8B" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/create")}
      >
        Send a Valentine ❤️
      </motion.button>

      {/* Stats */}
      <motion.p
        className="mt-6 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        💌 2,847 valentines sent so far
      </motion.p>

      {/* Bottom text */}
      <motion.p
        className="mt-4 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Already received one? Just open your link! 💝
      </motion.p>

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

export default HomePage;
