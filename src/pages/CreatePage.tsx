import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import NameEntry from "@/components/NameEntry";
import CharacterSelect, { type CharacterType } from "@/components/CharacterSelect";
import SoundToggle from "@/components/SoundToggle";
import BackButton from "@/components/BackButton";
import PageTransition from "@/components/PageTransition";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useCreateValentine } from "@/hooks/useCreateValentine";

type CreatePhase = "names" | "character";

const CreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillFrom = searchParams.get("from") || "";
  const prefillTo = searchParams.get("to") || "";
  const [yourName, setYourName] = useState(prefillFrom);
  const [theirName, setTheirName] = useState(prefillTo);
  const [loveNote, setLoveNote] = useState("");
  const [phase, setPhase] = useState<CreatePhase>("names");
  const sound = useSoundEffects();
  const { createValentine, isLoading } = useCreateValentine();

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
    async (character: CharacterType) => {
      const valentineId = await createValentine({
        senderName: yourName,
        receiverName: theirName,
        characterType: character,
        loveNote: loveNote,
      });

      if (valentineId) {
        navigate("/share", {
          state: { yourName, theirName, loveNote, character, valentineId },
        });
      } else {
        toast.error('Failed to create valentine. Please try again.');
      }
    },
    [navigate, yourName, theirName, loveNote, createValentine]
  );

  return (
    <PageTransition>
      <SoundToggle muted={sound.muted} onToggle={sound.toggleMute} />
      <BackButton
        onClick={phase === "character" ? () => setPhase("names") : undefined}
        to={phase === "names" ? "/" : undefined}
      />
      {phase === "names" ? (
        <NameEntry onSubmit={handleNamesSubmit} initialYourName={prefillFrom} initialTheirName={prefillTo} />
      ) : (
        <CharacterSelect onSelect={handleCharacterSelect} isLoading={isLoading} />
      )}
    </PageTransition>
  );
};

export default CreatePage;
