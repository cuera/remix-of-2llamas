import { motion } from "framer-motion";

// 0=transparent, 1=body(dark), 2=belly(light), 3=eye, 4=feet/beak
const PENGUIN_GRID = [
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,3,1,1,1,1,3,1,0,0],
  [0,0,1,1,1,4,4,1,1,1,0,0],
  [0,0,1,1,2,2,2,2,1,1,0,0],
  [0,1,1,2,2,2,2,2,2,1,1,0],
  [0,1,1,2,2,2,2,2,2,1,1,0],
  [0,1,1,2,2,2,2,2,2,1,1,0],
  [0,1,1,2,2,2,2,2,2,1,1,0],
  [0,0,1,1,2,2,2,2,1,1,0,0],
  [0,0,1,1,2,2,2,2,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,1,0,0,1,1,0,0,0],
  [0,0,4,4,4,0,0,4,4,4,0,0],
];

const COLOR_MAP = {
  green: {
    body: "hsl(140 60% 35%)",
    belly: "hsl(140 60% 85%)",
    eye: "hsl(var(--background))",
    accent: "hsl(140 60% 55%)",
  },
  pink: {
    body: "hsl(330 70% 35%)",
    belly: "hsl(330 80% 88%)",
    eye: "hsl(var(--background))",
    accent: "hsl(330 80% 55%)",
  },
};

interface PixelPenguinProps {
  color: "green" | "pink";
  mirror?: boolean;
  className?: string;
  confused?: boolean;
}

const PixelPenguin = ({ color, mirror = false, className = "", confused = false }: PixelPenguinProps) => {
  const colors = COLOR_MAP[color];

  const grid = mirror
    ? PENGUIN_GRID.map(row => [...row].reverse())
    : PENGUIN_GRID;

  const getCellColor = (cell: number) => {
    if (cell === 0) return "transparent";
    if (cell === 3) return colors.eye;
    if (cell === 4) return colors.accent;
    if (cell === 2) return colors.belly;
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
                boxShadow: cell ? `inset -1px -1px 0 ${colors.body}` : "none",
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

export default PixelPenguin;
