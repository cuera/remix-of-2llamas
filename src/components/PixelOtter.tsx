import { motion } from "framer-motion";

const OTTER_GRID = [
  [0, 0, 0, 5, 5, 0, 0, 5, 5, 0, 0, 0],  // row 0  - ears
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],  // row 1  - top of head
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],  // row 2  - head
  [0, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 0],  // row 3  - eyes + muzzle
  [0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0],  // row 4  - cheeks
  [0, 0, 1, 2, 2, 4, 4, 2, 2, 1, 0, 0],  // row 5  - nose
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],  // row 6  - chin
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],  // row 7  - neck
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],  // row 8  - upper body + belly
  [0, 5, 1, 1, 2, 2, 2, 2, 1, 1, 5, 0],  // row 9  - arms out
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],  // row 10 - mid body
  [0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0],  // row 11 - lower body
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],  // row 12 - hips
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],  // row 13 - legs
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],  // row 14 - feet
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],  // row 15 - tail
];

const OTTER_COLORS = {
  green: {
    main: "hsl(140 50% 40%)",   // body
    belly: "hsl(140 30% 72%)",  // belly/face
    nose: "hsl(140 25% 22%)",   // nose
    mid: "hsl(140 45% 33%)",    // mid-tone
  },
  pink: {
    main: "hsl(330 60% 52%)",
    belly: "hsl(330 45% 82%)",
    nose: "hsl(330 40% 32%)",
    mid: "hsl(330 55% 42%)",
  }
};

interface PixelOtterProps {
  color: "green" | "pink";
  mirror?: boolean;
  className?: string;
  confused?: boolean;
}

const PixelOtter = ({ color, mirror = false, className = "", confused = false }: PixelOtterProps) => {
  const colors = OTTER_COLORS[color];

  const grid = mirror
    ? OTTER_GRID.map(row => [...row].reverse())
    : OTTER_GRID;

  const getCellColor = (cell: number) => {
    if (cell === 0) return "transparent";
    if (cell === 3) return "hsl(var(--background))"; // Eye
    switch (cell) {
      case 1: return colors.main;
      case 2: return colors.belly;
      case 4: return colors.nose;
      case 5: return colors.mid;
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

export default PixelOtter;
