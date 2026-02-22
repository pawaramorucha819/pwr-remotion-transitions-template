import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { COLORS } from "./constants";

export const EffectSchema = z.object({
  title: z.string(),
  description: z.string(),
  audioBVolume: z.number().min(0).max(1).optional(),
  colors: z.object({
    bg: zColor(),
    primary: zColor(),
    secondary: zColor(),
    accent: zColor(),
    highlight: zColor(),
    text: zColor(),
    textDark: zColor(),
    sceneA: zColor(),
    sceneB: zColor(),
    gray: zColor(),
    darkGray: zColor(),
    lightGray: zColor(),
  }),
});

export type EffectProps = z.infer<typeof EffectSchema>;
export type ColorsType = EffectProps["colors"];

export const DEFAULT_COLORS: ColorsType = { ...COLORS };
