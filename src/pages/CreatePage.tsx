import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NameEntry from "@/components/NameEntry";
import CharacterSelect, { type CharacterType } from "@/components/CharacterSelect";
import SoundToggle from "@/components/SoundToggle";
import BackButton from "@/components/BackButton";
import PageTransition from "@/components/PageTransition";
import { useSoundEffects } from "@/hooks/useSoundEffects";

type CreatePhase = "names" | "character";

const CreatePage = () => {
  const navigate = useNavigate();
  const [yourName, setYourName] = useState("");
  const [theirName, setTheirName] = useState("");
  const [loveNote, setLoveNote] = useState("");
  const [phase, setPhase] = useState<CreatePhase>("names");
  const sound = useSoundEffects();

  const handleNamesSubmit = useCallback(
    (y: string, t: string, note: string) => {
      setYourName(y);
      setTheirName(t);
      setLoveNote(note);
      setPhase("character");
      sound.playBloop();
    },
    [sound]
  );

  const handleCharacterSelect = useCallback(
    (character: CharacterType) => {
      navigate("/share", {
        state: { yourName, theirName, loveNote, character },
      });
    },
    [navigate, yourName, theirName, loveNote]
  );

  return (
    <PageTransition>
      <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
      <BackButton
        onClick={phase === "character" ? () => setPhase("names") : undefined}
        to={phase === "names" ? "/" : undefined}
      />
      {phase === "names" ? (
        <NameEntry onSubmit={handleNamesSubmit} />
      ) : (
        <CharacterSelect onSelect={handleCharacterSelect} />
      )}
    </PageTransition>
  );
};

export default CreatePage;
