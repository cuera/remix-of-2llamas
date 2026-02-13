import { motion } from "framer-motion";

const LOBSTER_GRID = [
  [0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0],  // row 0  - claw tips
  [2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0],  // row 1  - claws
  [0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0],  // row 2  - claw base
  [0, 0, 2, 1, 0, 0, 0, 1, 2, 0, 0, 0],  // row 3  - arms
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],  // row 4  - top of head
  [0, 0, 1, 1, 3, 1, 3, 1, 1, 0, 0, 0],  // row 5  - eyes
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],  // row 6  - face
  [0, 0, 0, 1, 4, 4, 4, 1, 0, 0, 0, 0],  // row 7  - accent stripe
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],  // row 8  - upper body
  [0, 0, 0, 1, 4, 1, 4, 1, 0, 0, 0, 0],  // row 9  - body stripe
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],  // row 10 - body
  [0, 0, 0, 1, 4, 1, 4, 1, 0, 0, 0, 0],  // row 11 - body stripe
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],  // row 12 - lower body
  [0, 0, 5, 0, 1, 1, 1, 0, 5, 0, 0, 0],  // row 13 - upper legs
  [0, 5, 0, 0, 0, 1, 0, 0, 0, 5, 0, 0],  // row 14 - lower legs
  [0, 0, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0],  // row 15 - tail fan
];

const LOBSTER_COLORS = {
  green: {
    main: "hsl(140 55% 45%)",    // body
    claw: "hsl(140 60% 38%)",    // claw
    accent: "hsl(140 45% 55%)",  // accent
    legs: "hsl(140 50% 40%)",    // legs
  },
  pink: {
    main: "hsl(330 75% 58%)",    // body
    claw: "hsl(330 80% 48%)",    // claw
    accent: "hsl(330 65% 70%)",  // accent
    legs: "hsl(330 70% 52%)",    // legs
  }
};

interface PixelLobsterProps {
  color: "green" | "pink";
  mirror?: boolean;
  className?: string;
  confused?: boolean;
}

const PixelLobster = ({ color, mirror = false, className = "", confused = false }: PixelLobsterProps) => {
  const colors = LOBSTER_COLORS[color];

  const grid = mirror
    ? LOBSTER_GRID.map(row => [...row].reverse())
    : LOBSTER_GRID;

  const getCellColor = (cell: number) => {
    if (cell === 0) return "transparent";
    if (cell === 3) return "hsl(var(--background))"; // Eye
    switch (cell) {
      case 1: return colors.main;
      case 2: return colors.claw;
      case 4: return colors.accent;
      case 5: return colors.legs;
      default: return colors.main;
    }
  };

  return (
    <motion.div className={`inline-block ${className}`}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, var(--pixel-size))`,
          gridTemplateRows: `repeat(${grid.length}, var(--pixel-size))`,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: "var(--pixel-size)",
                height: "var(--pixel-size)",
                backgroundColor: getCellColor(cell),
                boxShadow: cell ? `inset -1px -1px 0 rgba(0,0,0,0.1)` : "none",
              }}
            />
          ))
        )}
      </div>
      {confused && (
        <motion.div
          className="text-center text-2xl -mt-2"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          ?
        </motion.div>
      )}
    </motion.div>
  );
};

export default PixelLobster;
