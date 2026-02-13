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
