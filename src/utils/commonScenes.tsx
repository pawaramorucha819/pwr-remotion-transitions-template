import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, WIDTH, HEIGHT } from "./constants";
import type { ColorsType } from "./schema";
import { genEiFont } from "./font";

export const SceneA: React.FC<{
  style?: React.CSSProperties;
  colors?: ColorsType;
}> = ({ style, colors }) => {
  const c = colors ?? COLORS;
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        background: `linear-gradient(135deg, ${c.primary} 0%, #c0392b 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        ...style,
      }}
    >
      <Img
        src={staticFile("image/akane-chan.png")}
        style={{
          width: 480,
          height: 480,
          objectFit: "contain",
          marginBottom: 40,
        }}
      />
      <div
        style={{
          color: c.text,
          fontSize: 80,
          fontWeight: "bold",
          fontFamily: genEiFont,
        }}
      >
        Scene A
      </div>
    </div>
  );
};

export const SceneB: React.FC<{
  style?: React.CSSProperties;
  colors?: ColorsType;
}> = ({ style, colors }) => {
  const c = colors ?? COLORS;
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        background: `linear-gradient(135deg, ${c.secondary} 0%, #1a5276 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        ...style,
      }}
    >
      <Img
        src={staticFile("image/aoi-chan.png")}
        style={{
          width: 480,
          height: 480,
          objectFit: "contain",
          marginBottom: 40,
        }}
      />
      <div
        style={{
          color: c.text,
          fontSize: 80,
          fontWeight: "bold",
          fontFamily: genEiFont,
        }}
      >
        Scene B
      </div>
    </div>
  );
};

export const PlaceholderScene: React.FC<{
  color: string;
  text: string;
  style?: React.CSSProperties;
  colors?: ColorsType;
}> = ({ color, text, style, colors }) => {
  const c = colors ?? COLORS;
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        background: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        ...style,
      }}
    >
      <div
        style={{
          color: c.text,
          fontSize: 48,
          fontWeight: "bold",
          fontFamily: genEiFont,
        }}
      >
        {text}
      </div>
    </div>
  );
};
