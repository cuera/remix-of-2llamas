import PixelAlpaca from "@/components/PixelAlpaca";
import PixelLlama from "@/components/PixelLlama";
import PixelPanda from "@/components/PixelPanda";
import PixelOtter from "@/components/PixelOtter";
import PixelLobster from "@/components/PixelLobster";
import PixelPenguin from "@/components/PixelPenguin";
import type { CharacterType } from "@/components/CharacterSelect";

export const CHARACTER_MAP: Record<CharacterType, typeof PixelAlpaca> = {
  otter: PixelOtter,
  penguin: PixelPenguin,
  lobster: PixelLobster,
  alpaca: PixelAlpaca,
  llama: PixelLlama,
  panda: PixelPanda,
};

export const APPROACH_DIST: Record<CharacterType, number> = {
  alpaca: 55,
  llama: 48,
  panda: 55,
  otter: 55,
  lobster: 50,
  penguin: 55,
};

export const CHARACTER_WORDPLAY: Record<CharacterType, string[]> = {
  lobster: ["You're my lobster", "Holding claws"],
  otter: [
    "Otterly in love",
    "We are made for each otter",
    "I love you like no otter",
    "You're my otter half",
    "Let's cuddle like sea otters",
  ],
  penguin: [
    "Waddle I do without you?",
    "You're my rock",
    "My love language is pebbling",
    "I searched the whole beach for the perfect stone",
    "Snowbody compares to you",
  ],
  llama: ["You are Llamazing", "Llama Mama loves you"],
  alpaca: ["Wool you be mine?", "I wool always love you"],
  panda: [
    "I can't bear to be without you",
    "I love you more than bamboo",
    "You're my panda-monium",
    "You're pandastic",
    "Our love is black and white",
  ],
};

/** Pick a stable-random wordplay line for a given valentine */
export function getWordplay(character: CharacterType, seed: string): string {
  const lines = CHARACTER_WORDPLAY[character];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return lines[Math.abs(hash) % lines.length];
}
