interface ChoiceButtonProps {
  label: string;
  color: "green" | "pink";
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const ChoiceButton = ({ label, color, selected, onClick, disabled }: ChoiceButtonProps) => {
  const borderColor = color === "green" ? "hsl(var(--alpaca-green))" : "hsl(var(--alpaca-pink))";
  const bgColor = selected ? borderColor : "transparent";
  const textColor = selected ? "hsl(var(--background))" : "hsl(var(--foreground))";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-5 py-2 text-lg font-hand rounded-md border-[3px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
      style={{
        borderColor,
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "'Patrick Hand', cursive",
      }}
    >
      {label}
    </button>
  );
};

export default ChoiceButton;
