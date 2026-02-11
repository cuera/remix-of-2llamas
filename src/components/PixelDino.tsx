import { motion } from "framer-motion";

const DINO_GRID = [
  [0,0,0,0,0,0,0,2,0,2,0,0,0,0,0],
  [0,0,0,0,0,0,0,2,0,2,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,1,1,2,1,3,1,1],
  [0,0,0,0,0,0,0,0,2,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,1,2,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,2,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,2,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,2,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,2,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,1,0,0,0,0],
  [0,2,1,2,1,4,2,4,4,1,1,0,0,0,0],
  [2,0,1,5,2,1,4,2,4,2,1,0,0,0,0],
  [0,0,1,4,1,1,4,1,1,1,2,0,0,0,0],
  [0,0,1,2,1,1,2,4,1,2,1,0,0,0,0],
  [0,0,1,1,2,1,4,2,1,1,2,0,0,0,0],
  [0,0,1,1,1,1,1,4,1,1,1,0,0,0,0],
  [0,0,2,1,0,0,0,0,0,1,2,0,0,0,0],
  [0,0,1,2,0,0,0,0,0,2,1,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,1,5,0,0,0,0],
  [0,0,5,1,0,0,0,0,0,2,1,0,0,0,0],
  [0,0,2,5,0,0,0,0,0,1,2,0,0,0,0],
  [0,0,5,2,0,0,0,0,0,5,1,0,0,0,0],
  [0,0,1,5,0,0,0,0,0,1,2,0,0,0,0],
];

const EYE_POS = { row: 2, col: 12 };

const COLOR_MAP = {
  green: {
    main: "hsl(140 60% 50%)",
    accent: "hsl(220 80% 40%)",
    shade1: "hsl(140 50% 44%)",
    shade2: "hsl(140 45% 40%)",
    dark: "hsl(140 60% 35%)",
  },
  pink: {
    main: "hsl(330 80% 65%)",
    accent: "hsl(270 70% 45%)",
    shade1: "hsl(330 70% 55%)",
    shade2: "hsl(330 60% 48%)",
    dark: "hsl(330 80% 50%)",
  },
};

interface PixelDinoProps {
  color: "green" | "pink";
  mirror?: boolean;
  className?: string;
  confused?: boolean;
}

const PixelDino = ({ color, mirror = false, className = "", confused = false }: PixelDinoProps) => {
  const colors = COLOR_MAP[color];

  const grid = mirror
    ? DINO_GRID.map(row => [...row].reverse())
    : DINO_GRID;

  const eyeCol = mirror ? DINO_GRID[0].length - 1 - EYE_POS.col : EYE_POS.col;

  const getCellColor = (cell: number, r: number, c: number) => {
    if (cell === 0) return "transparent";
    const isEye = r === EYE_POS.row && c === eyeCol;
    if (isEye || cell === 3) return "hsl(var(--background))";
    switch (cell) {
      case 1: return colors.main;
      case 2: return colors.accent;
      case 4: return colors.shade1;
      case 5: return colors.shade2;
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
                backgroundColor: getCellColor(cell, r, c),
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

export default PixelDino;
