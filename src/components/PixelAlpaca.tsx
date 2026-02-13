import { motion } from "framer-motion";

const ALPACA_GRID = [
  [0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,0,0,0,0,0,1,1,1,1,0],
  [0,0,0,0,0,0,0,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
];

const EYE_POS = { row: 2, col: 9 };

interface PixelAlpacaProps {
  color: "green" | "pink";
  mirror?: boolean;
  className?: string;
  confused?: boolean;
}

const PixelAlpaca = ({ color, mirror = false, className = "", confused = false }: PixelAlpacaProps) => {
  const fillColor = color === "green" ? "hsl(var(--brand-green))" : "hsl(var(--brand-pink))";
  const darkColor = color === "green" ? "hsl(140 60% 35%)" : "hsl(330 80% 40%)";

  const grid = mirror
    ? ALPACA_GRID.map(row => [...row].reverse())
    : ALPACA_GRID;

  const eyeCol = mirror ? ALPACA_GRID[0].length - 1 - EYE_POS.col : EYE_POS.col;

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
          row.map((cell, c) => {
            const isEye = r === EYE_POS.row && c === eyeCol;
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: "var(--pixel-size)",
                  height: "var(--pixel-size)",
                  backgroundColor: cell
                    ? isEye
                      ? "hsl(var(--background))"
                      : fillColor
                    : "transparent",
                  boxShadow: cell ? `inset -1px -1px 0 ${darkColor}` : "none",
                }}
              />
            );
          })
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

export default PixelAlpaca;
