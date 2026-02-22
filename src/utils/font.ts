import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const family = "GenEiMGothic2";

loadFont({
  family,
  url: staticFile("font/GenEiMGothic2-Black.ttf"),
  weight: "900",
});

export const genEiFont = family;
