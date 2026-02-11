import { motion } from "framer-motion";

const PANDA_GRID = [
  [0,0,0,2,2,0,0,0,0,2,2,0],
  [0,0,2,2,2,0,0,0,2,2,2,0],
  [0,0,0,2,2,2,2,2,2,2,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,1,2,2,1,1,1,2,2,1,1,0],
  [0,1,2,3,1,1,1,2,3,1,1,0],
  [0,1,1,1,1,2,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,2,2,1,1,1,1,2,2,0,0],
  [0,0,2,2,0,0,0,0,2,2,0,0],
  [0,0,2,2,0,0,0,0,2,2,0,0],
];

const EYE_POS_LEFT = { row: 5, col: 3 };
const EYE_POS_RIGHT = { row: 5, col: 8 };

const COLOR_MAP = {
  green: {
    body: "hsl(140 60% 90%)",
    dark: "hsl(140 60% 30%)",
    shadow: "hsl(140 50% 25%)",
  },
  pink: {
    body: "hsl(330 80% 90%)",
    dark: "hsl(330 70% 40%)",
    shadow: "hsl(330 60% 35%)",
  },
};

interface PixelPandaProps {
  color: "green" | "pink";
  mirror?: boolean;
  className?: string;
  confused?: boolean;
}

const PixelPanda = ({ color, mirror = false, className = "", confused = false }: PixelPandaProps) => {
  const colors = COLOR_MAP[color];

  const grid = mirror
    ? PANDA_GRID.map(row => [...row].reverse())
    : PANDA_GRID;

  const getCellColor = (cell: number, r: number, c: number) => {
    if (cell === 0) return "transparent";
    const eyeL = mirror ? PANDA_GRID[0].length - 1 - EYE_POS_LEFT.col : EYE_POS_LEFT.col;
    const eyeR = mirror ? PANDA_GRID[0].length - 1 - EYE_POS_RIGHT.col : EYE_POS_RIGHT.col;
    if (r === EYE_POS_LEFT.row && (c === eyeL || c === eyeR)) return "hsl(var(--background))";
    if (cell === 3) return "hsl(var(--background))";
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
                backgroundColor: getCellColor(cell, r, c),
                boxShadow: cell ? `inset -1px -1px 0 ${colors.shadow}` : "none",
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

export default PixelPanda;
