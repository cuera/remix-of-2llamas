import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ShareScreen from "@/components/ShareScreen";
import SoundToggle from "@/components/SoundToggle";
import BackButton from "@/components/BackButton";
import PageTransition from "@/components/PageTransition";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import type { CharacterType } from "@/components/CharacterSelect";

interface ShareState {
  yourName: string;
  theirName: string;
  loveNote: string;
  character: CharacterType;
  valentineId: string;
}

const SharePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sound = useSoundEffects();
  const state = location.state as ShareState | null;

  useEffect(() => {
    if (!state) {
      navigate("/create", { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const handleSendAnother = () => {
    navigate("/create", { replace: true });
  };

  const handlePreviewAsReceiver = () => {
    navigate(`/v/${state.valentineId}`);
  };

  return (
    <PageTransition>
      <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
      <BackButton to="/create" />
      <ShareScreen
        yourName={state.yourName}
        theirName={state.theirName}
        character={state.character}
        loveNote={state.loveNote}
        valentineId={state.valentineId}
        onSendAnother={handleSendAnother}
        onPreviewAsReceiver={handlePreviewAsReceiver}
      />
    </PageTransition>
  );
};

export default SharePage;
