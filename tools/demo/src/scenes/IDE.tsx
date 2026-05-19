import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig, spring } from "remotion";
import { THEME } from "../theme";
import { IDEChrome } from "../components/IDEChrome";
import { Typewriter } from "../components/Typewriter";

// 90 frames (3 sec). Local frame starts at 0.
// 0..18   IDE settles in (spring)
// 18..40  user types "Set up SEO for this site"
// 40..50  skill thinking dots
// 50..90  head tags type into the editor, one per ~6 frames
export const IDE: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const frame = localFrame;
  const { fps } = useVideoConfig();
  const settle = spring({ frame, fps, config: { damping: 22, stiffness: 70 } });
  const thinking = interpolate(frame, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lines = HEAD_LINES;
  const lineStarts = lines.map((_, i) => 50 + i * 5);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 80% at 50% 0%, #1A1A2E 0%, ${THEME.bg} 70%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ transform: `scale(${0.95 + settle * 0.05})`, opacity: settle }}>
        <IDEChrome>
          {/* Left: file tree-ish */}
          <div
            style={{
              width: 200,
              borderRight: `1px solid ${THEME.panelBorder}`,
              padding: "14px 14px",
              fontSize: 13,
              color: THEME.fgDim,
              fontFamily: THEME.fontSans,
            }}
          >
            <div style={{ color: THEME.fg, marginBottom: 10, fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
              Explorer
            </div>
            <FileRow icon="📁" label="src" dim />
            <FileRow icon="📁" label="public" dim />
            <FileRow icon="📄" label="layout.tsx" active />
            <FileRow icon="📄" label="page.tsx" dim />
            <FileRow icon="📄" label="package.json" dim />
            <FileRow icon="📁" label=".cursor" dim />
            <div style={{ paddingLeft: 14, marginTop: 2 }}>
              <FileRow icon="📄" label="rules" dim small />
              <div style={{ paddingLeft: 14 }}>
                <FileRow icon="📜" label="seo-pro-max.mdc" accent small />
              </div>
            </div>
          </div>

          {/* Center: code */}
          <div style={{ flex: 1, padding: "16px 24px", fontSize: 17, lineHeight: 1.55, color: THEME.fg }}>
            <div style={{ color: THEME.fgMuted, fontSize: 13, marginBottom: 8, fontFamily: THEME.fontSans }}>
              app/layout.tsx
            </div>
            <CodeLine>
              <Tag>&lt;head&gt;</Tag>
            </CodeLine>
            {lines.map((line, i) => (
              <CodeLineAnimated
                key={i}
                line={line}
                startFrame={lineStarts[i]}
                endFrame={lineStarts[i] + 4}
                frame={frame}
              />
            ))}
            <CodeLine>
              <Tag>&lt;/head&gt;</Tag>
            </CodeLine>
          </div>

          {/* Right: chat */}
          <div
            style={{
              width: 320,
              borderLeft: `1px solid ${THEME.panelBorder}`,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontFamily: THEME.fontSans,
              fontSize: 14,
            }}
          >
            <div style={{ color: THEME.fgDim, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
              Chat
            </div>

            <ChatBubble role="user">
              <Typewriter
                text="@seo-pro-max set up SEO for this site"
                startFrame={18}
                endFrame={40}
                cursor
              />
            </ChatBubble>

            <ChatBubble role="assistant">
              {frame >= 40 && frame < 50 ? (
                <span style={{ color: THEME.fgDim }}>
                  Analyzing your project
                  <Dots frame={frame} />
                </span>
              ) : frame >= 50 ? (
                <span>
                  <span style={{ color: THEME.success }}>✓</span> Phase 0 done.
                  <br />
                  Writing meta, canonical, OG, JSON-LD, hreflang…
                </span>
              ) : null}
            </ChatBubble>
          </div>
        </IDEChrome>
      </div>
    </AbsoluteFill>
  );
};

const HEAD_LINES: Array<Array<{ kind: "tag" | "attr" | "string" | "text"; text: string }>> = [
  [
    { kind: "text", text: "  " },
    { kind: "tag", text: "<title>" },
    { kind: "text", text: "Acme · Production-ready SEO" },
    { kind: "tag", text: "</title>" },
  ],
  [
    { kind: "text", text: "  " },
    { kind: "tag", text: "<meta" },
    { kind: "attr", text: " name" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"description"' },
    { kind: "attr", text: " content" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"Acme builds…"' },
    { kind: "tag", text: " />" },
  ],
  [
    { kind: "text", text: "  " },
    { kind: "tag", text: "<link" },
    { kind: "attr", text: " rel" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"canonical"' },
    { kind: "attr", text: " href" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"https://acme.io/"' },
    { kind: "tag", text: " />" },
  ],
  [
    { kind: "text", text: "  " },
    { kind: "tag", text: "<meta" },
    { kind: "attr", text: " property" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"og:image"' },
    { kind: "attr", text: " content" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"/og/home.png"' },
    { kind: "tag", text: " />" },
  ],
  [
    { kind: "text", text: "  " },
    { kind: "tag", text: "<meta" },
    { kind: "attr", text: " name" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"twitter:card"' },
    { kind: "attr", text: " content" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"summary_large_image"' },
    { kind: "tag", text: " />" },
  ],
  [
    { kind: "text", text: "  " },
    { kind: "tag", text: "<link" },
    { kind: "attr", text: " rel" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"alternate"' },
    { kind: "attr", text: " hreflang" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"tr"' },
    { kind: "tag", text: " />" },
  ],
  [
    { kind: "text", text: "  " },
    { kind: "tag", text: "<script" },
    { kind: "attr", text: " type" },
    { kind: "text", text: "=" },
    { kind: "string", text: '"application/ld+json"' },
    { kind: "tag", text: ">…</script>" },
  ],
];

const colorFor = (kind: "tag" | "attr" | "string" | "text") => {
  switch (kind) {
    case "tag": return THEME.syntax.tag;
    case "attr": return THEME.syntax.attr;
    case "string": return THEME.syntax.string;
    case "text":
    default: return THEME.syntax.text;
  }
};

const CodeLine: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ whiteSpace: "pre", fontFamily: THEME.fontMono }}>{children}</div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: THEME.syntax.tag }}>{children}</span>
);

const CodeLineAnimated: React.FC<{
  line: Array<{ kind: "tag" | "attr" | "string" | "text"; text: string }>;
  startFrame: number;
  endFrame: number;
  frame: number;
}> = ({ line, startFrame, endFrame, frame }) => {
  const reveal = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (reveal === 0) return <div style={{ height: 28 }} />;
  const slide = (1 - reveal) * 18;
  return (
    <div
      style={{
        whiteSpace: "pre",
        fontFamily: THEME.fontMono,
        opacity: reveal,
        transform: `translateX(${slide}px)`,
        height: 28,
      }}
    >
      {line.map((seg, i) => (
        <span key={i} style={{ color: colorFor(seg.kind) }}>
          {seg.text}
        </span>
      ))}
    </div>
  );
};

const FileRow: React.FC<{
  icon: string;
  label: string;
  dim?: boolean;
  active?: boolean;
  accent?: boolean;
  small?: boolean;
}> = ({ icon, label, dim, active, accent, small }) => (
  <div
    style={{
      color: accent ? THEME.accent : active ? THEME.fg : dim ? THEME.fgDim : THEME.fg,
      padding: "3px 0",
      fontSize: small ? 12 : 13,
      background: active ? "rgba(124, 108, 255, 0.08)" : "transparent",
      borderRadius: 4,
      paddingLeft: active ? 6 : 0,
    }}
  >
    {icon} {label}
  </div>
);

const ChatBubble: React.FC<{
  role: "user" | "assistant";
  children: React.ReactNode;
}> = ({ role, children }) => (
  <div
    style={{
      alignSelf: role === "user" ? "flex-end" : "flex-start",
      maxWidth: "92%",
      background:
        role === "user"
          ? "rgba(124, 108, 255, 0.14)"
          : "rgba(34, 211, 238, 0.08)",
      border: `1px solid ${role === "user" ? THEME.accent + "55" : THEME.accent2 + "33"}`,
      color: THEME.fg,
      padding: "8px 11px",
      borderRadius: 10,
      fontSize: 14,
      lineHeight: 1.4,
    }}
  >
    {children}
  </div>
);

const Dots: React.FC<{ frame: number }> = ({ frame }) => {
  const n = (Math.floor(frame / 4) % 4);
  return <span>{".".repeat(n)}</span>;
};
