import { useState } from "react";
import { motion } from "framer-motion";

interface NameEntryProps {
  onSubmit: (yourName: string, theirName: string) => void;
}

const NameEntry = ({ onSubmit }: NameEntryProps) => {
  const [yourName, setYourName] = useState("");
  const [theirName, setTheirName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (yourName.trim() && theirName.trim()) {
      onSubmit(yourName.trim(), theirName.trim());
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl text-foreground mb-10 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        BE MY VALENTINE? 💕
      </motion.h1>

      <motion.form
        className="flex flex-col items-center gap-6 w-full max-w-sm"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-col gap-2">
          <label className="text-xl text-foreground" htmlFor="yourName">Your Name</label>
          <input
            id="yourName"
            type="text"
            placeholder="Your name"
            value={yourName}
            onChange={(e) => setYourName(e.target.value.slice(0, 30))}
            required
            className="w-full px-4 py-3 text-xl rounded-lg border-[3px] border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-xl text-foreground" htmlFor="theirName">Their Name</label>
          <input
            id="theirName"
            type="text"
            placeholder="Your Valentine's name"
            value={theirName}
            onChange={(e) => setTheirName(e.target.value.slice(0, 30))}
            required
            className="w-full px-4 py-3 text-xl rounded-lg border-[3px] border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <motion.button
          type="submit"
          className="px-10 py-3 text-2xl rounded-lg border-[3px] border-primary text-foreground transition-all hover:scale-105 active:scale-95 mt-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next 💘
        </motion.button>
      </motion.form>

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

export default NameEntry;
