import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { THEME } from "../theme";
import { TerminalChrome } from "../components/TerminalChrome";
import { Typewriter } from "../components/Typewriter";

// 0..90 frame  (3 seconds at 30fps)
//  0..36   user types `npx seo-pro-max install`
// 36..50   pause + enter pressed
// 50..60   "Detected: Cursor" line fades in
// 60..72   "✓ Installed -> .cursor/rules/seo-pro-max.mdc"
// 72..90   blinking cursor at the end
export const Terminal: React.FC<{ localFrame?: number }> = ({ localFrame }) => {
  const frame = localFrame ?? useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const detectedOpacity = interpolate(frame, [50, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const installedOpacity = interpolate(frame, [60, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 80% at 50% 0%, #14213D 0%, ${THEME.bg} 70%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ transform: `scale(${0.92 + enter * 0.08})`, opacity: enter }}>
        <TerminalChrome>
          <div style={{ fontSize: 22, lineHeight: 1.55, color: THEME.fg }}>
            <Line>
              <Prompt />{" "}
              <Typewriter
                text="npx seo-pro-max install"
                startFrame={6}
                endFrame={36}
                cursor={frame < 50}
                style={{ color: THEME.fg }}
              />
            </Line>

            <div style={{ opacity: detectedOpacity, marginTop: 14 }}>
              <Line style={{ color: THEME.fgDim }}>
                <span style={{ color: THEME.accent2 }}>✓</span>{" "}
                <span style={{ color: THEME.fg }}>Detected: </span>
                <span style={{ color: THEME.accent }}>Cursor</span>
              </Line>
            </div>

            <div style={{ opacity: installedOpacity, marginTop: 6 }}>
              <Line style={{ color: THEME.fgDim }}>
                <span style={{ color: THEME.success }}>✓</span>{" "}
                <span style={{ color: THEME.fg }}>Installed</span>{" "}
                <span style={{ color: THEME.fgDim }}>→</span>{" "}
                <span style={{ color: THEME.accent2 }}>
                  .cursor/rules/seo-pro-max.mdc
                </span>
              </Line>
            </div>

            <div style={{ opacity: installedOpacity, marginTop: 18 }}>
              <Prompt />
              {frame >= 76 && Math.floor(frame / 15) % 2 === 0 ? (
                <span style={{ marginLeft: 6 }}>▍</span>
              ) : (
                <span style={{ marginLeft: 6, opacity: 0 }}>▍</span>
              )}
            </div>
          </div>
        </TerminalChrome>
      </div>
    </AbsoluteFill>
  );
};

const Prompt: React.FC = () => (
  <span style={{ color: THEME.accent }}>
    <span style={{ color: THEME.fgDim }}>~/projects/my-site</span>
    <span style={{ color: THEME.success }}> $</span>
  </span>
);

const Line: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => <div style={{ ...style }}>{children}</div>;
