import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// --- Pixel Grids ---

const LLAMA_GRID = [
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 3, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [0, 2, 1, 2, 1, 4, 2, 4, 4, 1, 1, 0, 0, 0, 0],
    [2, 0, 1, 5, 2, 1, 4, 2, 4, 2, 1, 0, 0, 0, 0],
    [0, 0, 1, 4, 1, 1, 4, 1, 1, 1, 2, 0, 0, 0, 0],
    [0, 0, 1, 2, 1, 1, 2, 4, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 2, 1, 4, 2, 1, 1, 2, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 4, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 2, 1, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0],
    [0, 0, 1, 2, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 5, 0, 0, 0, 0],
    [0, 0, 5, 1, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0],
    [0, 0, 2, 5, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0],
    [0, 0, 5, 2, 0, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0],
    [0, 0, 1, 5, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0],
];

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

const PENGUIN_GRID = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 3, 1, 3, 1, 1, 0, 0, 0, 0], // cell 3 is eye
    [0, 0, 0, 0, 1, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0], // Beak
    [0, 0, 0, 1, 1, 4, 4, 4, 4, 4, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 0],
    [0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0],
    [1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    [0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0],
    [0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 0],
    [0, 0, 0, 5, 5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0], // Feet
    [0, 0, 5, 5, 5, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0],
];

const GRIDS = [LLAMA_GRID, OTTER_GRID, LOBSTER_GRID, PENGUIN_GRID];

// --- Colors ---

const DEFAULT_COLORS = {
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

const OTTER_COLORS = {
    green: {
        main: "hsl(140 50% 40%)",   // body
        accent: "hsl(140 30% 72%)", // belly/face (cell 2)
        shade1: "hsl(140 25% 22%)", // nose (cell 4) -> used as accent here for mapping
        shade2: "hsl(140 45% 33%)", // mid-tone (cell 5)
        dark: "hsl(140 60% 30%)",
    },
    pink: {
        main: "hsl(330 60% 52%)",
        accent: "hsl(330 45% 82%)",
        shade1: "hsl(330 40% 32%)",
        shade2: "hsl(330 55% 42%)",
        dark: "hsl(330 60% 40%)",
    }
};

const LOBSTER_COLORS = {
    green: {
        main: "hsl(140 55% 45%)",   // body
        accent: "hsl(140 60% 38%)", // claw (cell 2)
        shade1: "hsl(140 45% 55%)", // accent (cell 4)
        shade2: "hsl(140 50% 40%)", // legs (cell 5)
        dark: "hsl(140 65% 35%)",
    },
    pink: {
        main: "hsl(330 75% 58%)",
        accent: "hsl(330 80% 48%)",
        shade1: "hsl(330 65% 70%)",
        shade2: "hsl(330 70% 52%)",
        dark: "hsl(330 85% 50%)",
    }
};

interface MorphingCharacterProps {
    color: "green" | "pink";
    mirror?: boolean;
    className?: string;
    delay?: number;
}

const MorphingCharacter = ({ color, mirror = false, className = "", delay = 0 }: MorphingCharacterProps) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Stagger the change slightly if needed, or sync them up.
        // Let's sync them for a "pair transformation" effect.
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % GRIDS.length);
        }, 5000); // Morph every 5 seconds (slower)

        return () => clearInterval(interval);
    }, []);

    const grid = mirror
        ? GRIDS[index].map(row => [...row].reverse())
        : GRIDS[index];

    const getColorMap = (idx: number) => {
        switch (idx) {
            case 1: return OTTER_COLORS;
            case 2: return LOBSTER_COLORS;
            default: return DEFAULT_COLORS;
        }
    };

    const colors = getColorMap(index)[color];

    // Logic to find eye position for each grid is tricky since they are different shapes.
    // We can just hardcode "3" in the grid for eyes to make it easy.
    // I updated grids above to use '3' for eyes where appropriate.

    const getCellColor = (cell: number) => {
        if (cell === 0) return "transparent";
        if (cell === 3) return "hsl(var(--background))"; // Eye
        switch (cell) {
            case 1: return colors.main;
            case 2: return colors.accent;
            case 4: return colors.shade1;
            case 5: return colors.shade2;
            default: return colors.main;
        }
    };

    return (
        <div className={`relative inline-block ${className}`} style={{ width: "calc(15 * var(--pixel-size))", height: "calc(32 * var(--pixel-size))" }}>
            <AnimatePresence mode="popLayout"> 
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(2px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(2px)" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
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
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default MorphingCharacter;
