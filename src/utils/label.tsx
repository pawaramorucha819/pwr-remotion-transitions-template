import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { genEiFont } from "./font";
import type { ColorsType } from "./schema";

export const Label: React.FC<{
  title: string;
  description?: string;
  colors?: ColorsType;
}> = ({ title, description }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame, fps, from: 0, to: 1, durationInFrames: 20 });
  const translateY = spring({
    frame,
    fps,
    from: 20,
    to: 0,
    durationInFrames: 20,
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.7)",
          padding: "8px 24px",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            color: "rgb(255,255,255)",
            fontSize: 52,
            //fontWeight: "bold",
            fontFamily: genEiFont,
            //WebkitTextStroke: "1px rgb(255,255,255)",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              color: "rgb(255,255,255)",
              fontSize: 40,
              fontFamily: genEiFont,
              //WebkitTextStroke: "1px rgb(255,255,255)",
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
