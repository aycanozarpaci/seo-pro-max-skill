import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { THEME } from "../theme";

// 30 frames (1 sec) — logo wordmark + tagline + npm install line
export const Outro: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const frame = localFrame;
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const subOpacity = interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 60% at 50% 50%, #1A1A2E 0%, ${THEME.bg} 80%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          opacity: enter,
          transform: `translateY(${(1 - enter) * 18}px)`,
          fontFamily: THEME.fontSans,
          fontSize: 78,
          fontWeight: 800,
          letterSpacing: -2,
          color: THEME.fg,
          textShadow: `0 0 40px ${THEME.accent}55`,
        }}
      >
        seo-pro-max
      </div>
      <div
        style={{
          opacity: subOpacity,
          fontFamily: THEME.fontSans,
          fontSize: 22,
          color: THEME.fgDim,
          textAlign: "center",
          maxWidth: 700,
          lineHeight: 1.4,
        }}
      >
        Production-grade SEO for AI coding agents.
        <br />
        Asks before writing. Never decides silently.
      </div>
      <div
        style={{
          opacity: subOpacity,
          marginTop: 12,
          fontFamily: THEME.fontMono,
          fontSize: 22,
          color: THEME.accent2,
          padding: "10px 22px",
          background: "rgba(34, 211, 238, 0.08)",
          border: `1px solid ${THEME.accent2}40`,
          borderRadius: 10,
        }}
      >
        npx seo-pro-max install
      </div>
    </AbsoluteFill>
  );
};
