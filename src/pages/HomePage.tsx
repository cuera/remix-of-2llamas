import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MorphingCharacter from "@/components/MorphingCharacter";
import PageTransition from "@/components/PageTransition";
import { useValentineCount, COUNTER_OFFSET } from "@/hooks/useValentineCount";

const HomePage = () => {
  const navigate = useNavigate();
  const { count, isLoading } = useValentineCount();

  return (
    <PageTransition>
      <div
        // Responsive Container:
        // Mobile: Locked to viewport height (h-[100dvh]), hidden overflow, centered content
        // Desktop (md+): Minimum screen height (min-h-screen), scrollable, top-aligned with padding
        className="w-full flex flex-col items-center relative 
                   h-[100dvh] overflow-hidden justify-center py-4 px-6
                   md:min-h-screen md:h-auto md:overflow-x-hidden md:justify-start md:py-20"
        style={{
          fontFamily: "'Patrick Hand', cursive",
          background: "radial-gradient(circle at 50% 30%, hsl(var(--background) / 0.7) 0%, hsl(var(--background)) 100%)"
        }}
      >
        {/* Animated background glow - Larger on desktop */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20 rounded-full pointer-events-none -z-10
                     w-[400px] h-[400px] blur-[120px]
                     md:w-[600px] md:h-[600px] md:blur-[150px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.45, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main Content Container 
            Mobile: Better vertical balance (justify-evenly), removed fixed gap
            Desktop: Spacious gap (md:gap-20), max-w-4xl, top margin
        */}
        <div className="flex flex-col items-center w-full 
                        max-w-lg flex-1 justify-evenly py-8
                        md:max-w-4xl md:gap-20 md:mt-12 md:flex-initial md:justify-start md:py-0">

          {/* Title Section */}
          <motion.div
            className="flex flex-col items-center gap-2 md:gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-foreground text-center tracking-tight drop-shadow-xl
                           text-5xl 
                           md:text-8xl">
              Otterly in Love 🦦
            </h1>
            <div className="bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full
                            h-1 w-24
                            md:h-1.5 md:w-32" />
          </motion.div>

          {/* Art Section */}
          <motion.div
            className="flex items-end 
                       gap-3 py-2
                       md:gap-24 md:py-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {/* Green Character (Morphing) */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, -2, 0]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <MorphingCharacter color="green" className="scale-[0.62] md:scale-[1.2]" />
            </motion.div>

            {/* Pulsing heart */}
            <motion.span
              className="opacity-90 
                         text-3xl mb-6
                         md:text-6xl md:mb-20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
                y: [0, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              ❤️
            </motion.span>

            {/* Pink Character (Morphing) */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
            >
              <MorphingCharacter color="pink" mirror className="scale-[0.62] md:scale-[1.2]" />
            </motion.div>
          </motion.div>

          {/* Text Section */}
          <motion.div
            className="flex flex-col items-center gap-2 md:gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-center opacity-100 font-medium leading-relaxed
                          text-xl max-w-[280px]
                          md:text-4xl md:max-w-xl"
              style={{ color: "hsl(var(--soft-pink))" }}>
              Send a pixel valentine to someone special 💕
            </p>
          </motion.div>

          {/* Interaction Section */}
          <motion.div
            className="flex flex-col items-center w-full
                       gap-6
                       md:gap-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            <motion.button
              className="group relative rounded-[2rem] text-primary-foreground font-bold bg-primary shadow-lg transition-all w-full
                         px-10 py-5 text-2xl max-w-[320px] shadow-primary/30
                         md:px-12 md:py-6 md:text-4xl md:max-w-[400px] md:shadow-[0_20px_50px_rgba(233,30,139,0.3)]"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/create")}
            >
              <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4">
                Send a Valentine <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>❤️</motion.span>
              </span>
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -inset-[1px] md:-inset-[2px] rounded-[calc(2rem+1px)] md:rounded-[calc(2rem+2px)] bg-white/20 md:bg-gradient-to-b md:from-white/30 md:to-transparent -z-10" />
            </motion.button>

            {/* Proof Section */}
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <motion.div
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm
                           px-5 py-2
                           md:px-8 md:py-3 md:backdrop-blur-xl md:shadow-2xl"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="text-muted-foreground font-semibold tracking-wide
                              text-sm
                              md:text-xl">
                  {count === null || isLoading ? (
                    "💌 Magic loading..."
                  ) : (
                    `💌 ${(count + COUNTER_OFFSET).toLocaleString()} valentines sent so far`
                  )}
                </p>
              </motion.div>
              <p className="opacity-40 font-medium tracking-tight
                            text-xs
                            md:text-base">
                Got one? Just open your unique link! 💝
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating elements - Configured for both views */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
          {[
            { left: "8%", top: "12%", delay: 0, duration: 6, size: "text-4xl md:text-6xl", opacity: 0.08 },
            { left: "88%", top: "18%", delay: 1.5, duration: 8, size: "text-2xl md:text-4xl", opacity: 0.05 },
            { left: "12%", top: "82%", delay: 3, duration: 7, size: "text-5xl md:text-7xl", opacity: 0.06 },
            { left: "82%", top: "78%", delay: 4.5, duration: 9, size: "text-3xl md:text-5xl", opacity: 0.04 },
            { left: "50%", top: "5%", delay: 2, duration: 10, size: "text-xl md:text-3xl", opacity: 0.03 },
            // Desktop-only extra elements
            { left: "75%", top: "40%", delay: 2, duration: 11, size: "hidden md:block md:text-2xl", opacity: 0.04 },
            { left: "20%", top: "35%", delay: 5, duration: 13, size: "hidden md:block md:text-4xl", opacity: 0.05 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos.size}`}
              style={{ left: pos.left, top: pos.top, opacity: pos.opacity }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: pos.duration,
                delay: pos.delay,
                ease: "easeInOut"
              }}
            >
              {i % 2 === 0 ? "💕" : "❤️"}
            </motion.div>
          ))}
        </div>

        {/* Floating accents background - Restored */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
          {[
            { left: "10%", top: "15%", delay: 0, duration: 5, size: "text-2xl" },
            { left: "85%", top: "20%", delay: 1, duration: 7, size: "text-xl" },
            { left: "15%", top: "75%", delay: 2, duration: 6, size: "text-3xl" },
            { left: "80%", top: "80%", delay: 3.5, duration: 8, size: "text-2xl" },
            { left: "50%", top: "10%", delay: 1.5, duration: 9, size: "text-lg" },
          ].map((pos, i) => (
            <motion.div
              key={`accent-${i}`}
              className={`absolute ${pos.size} opacity-[0.05]`}
              style={{ left: pos.left, top: pos.top }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: pos.duration,
                delay: pos.delay,
                ease: "easeInOut"
              }}
            >
              {i % 2 === 0 ? "💕" : "❤️"}
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage;
