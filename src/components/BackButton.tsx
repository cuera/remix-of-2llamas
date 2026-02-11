import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  state?: unknown;
  onClick?: () => void;
}

const BackButton = ({ to, state, onClick }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to, { state, replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-full border-2 border-border bg-card/80 backdrop-blur-sm text-lg cursor-pointer transition-transform hover:scale-110 active:scale-95 min-h-[48px] min-w-[48px]"
      title="Go back"
      style={{ fontFamily: "'Patrick Hand', cursive" }}
    >
      ←
    </button>
  );
};

export default BackButton;
