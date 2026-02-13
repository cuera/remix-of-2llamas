import PixelAlpaca from "@/components/PixelAlpaca";
import PixelDino from "@/components/PixelDino";
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
  dino: PixelDino,
  panda: PixelPanda,
};

export const APPROACH_DIST: Record<CharacterType, number> = {
  alpaca: 55,
  dino: 48,
  panda: 55,
  otter: 55,
  lobster: 50,
  penguin: 55,
};
