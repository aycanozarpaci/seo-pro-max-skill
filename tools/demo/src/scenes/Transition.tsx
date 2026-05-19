import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME } from "../theme";

// 30 frames (1 sec). Camera dolly + flash → IDE comes in.
export const Transition: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const frame = localFrame;
  const flash = interpolate(frame, [0, 8, 16], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slide = interpolate(frame, [0, 30], [0, -1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: THEME.bg, transform: `translateY(${slide}px)` }}>
      <AbsoluteFill
        style={{
          background: "white",
          opacity: flash * 0.85,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
