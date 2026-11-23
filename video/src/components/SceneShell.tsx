import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../theme";
import { clamp } from "../lib/motion";

export const SceneShell: React.FC<{
  duration: number;
  background?: string;
  children: React.ReactNode;
  grid?: boolean;
}> = ({ duration, background = colors.bg, children, grid = false }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const fadeOut = interpolate(
    frame,
    [Math.max(0, duration - 10), duration],
    [1, 0],
    clamp
  );
  return (
    <AbsoluteFill
      style={{
        background,
        opacity: Math.min(fadeIn, fadeOut),
        fontFamily: font,
        overflow: "hidden",
        backgroundImage: grid
          ? "radial-gradient(rgba(44,62,80,.13) 1.3px, transparent 1.3px)"
          : undefined,
        backgroundSize: grid ? "34px 34px" : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{
  children: React.ReactNode;
  light?: boolean;
}> = ({ children, light = false }) => (
  <div
    style={{
      fontSize: 17,
      letterSpacing: 4,
      fontWeight: 700,
      color: light ? "rgba(255,255,255,.55)" : colors.red,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);
