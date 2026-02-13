import { motion } from "framer-motion";

// 0=transparent, 1=body, 2=dark/accent, 3=eye/nose
const OTTER_GRID = [
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,2,1,1,1,1,1,1,2,0,0],
  [0,2,1,1,1,1,1,1,1,1,2,0],
  [0,2,1,3,1,1,1,1,3,1,2,0],
  [0,2,1,1,1,3,3,1,1,1,2,0],
  [0,0,2,1,1,1,1,1,1,2,0,0],
  [0,0,0,2,1,1,1,1,2,0,0,0],
  [0,0,2,1,1,1,1,1,1,2,0,0],
  [0,2,1,1,1,1,1,1,1,1,2,0],
  [2,1,1,1,1,1,1,1,1,1,1,2],
  [2,1,1,1,1,1,1,1,1,1,1,2],
  [0,2,1,1,1,1,1,1,1,1,2,0],
  [0,0,2,1,1,1,1,1,1,2,0,0],
  [0,0,2,2,0,0,0,0,2,2,0,0],
  [0,0,2,2,0,0,0,0,2,2,0,0],
];

const COLOR_MAP = {
  green: {
    body: "hsl(140 60% 70%)",
    dark: "hsl(140 60% 35%)",
    eye: "hsl(var(--background))",
  },
  pink: {
    body: "hsl(330 80% 75%)",
    dark: "hsl(330 70% 40%)",
    eye: "hsl(var(--background))",
  },
};

interface PixelOtterProps {
  color: "green" | "pink";
  mirror?: boolean;
  className?: string;
  confused?: boolean;
}

const PixelOtter = ({ color, mirror = false, className = "", confused = false }: PixelOtterProps) => {
  const colors = COLOR_MAP[color];

  const grid = mirror
    ? OTTER_GRID.map(row => [...row].reverse())
    : OTTER_GRID;

  const getCellColor = (cell: number) => {
    if (cell === 0) return "transparent";
    if (cell === 3) return colors.eye;
    if (cell === 2) return colors.dark;
    return colors.body;
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
                boxShadow: cell ? `inset -1px -1px 0 ${colors.dark}` : "none",
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
