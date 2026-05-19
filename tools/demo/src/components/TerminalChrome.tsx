import React from "react";
import { THEME } from "../theme";

export const TerminalChrome: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title = "~/projects/my-site — bash", children }) => {
  return (
    <div
      style={{
        width: 1080,
        margin: "0 auto",
        background: THEME.panel,
        border: `1px solid ${THEME.panelBorder}`,
        borderRadius: 14,
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        overflow: "hidden",
        fontFamily: THEME.fontMono,
      }}
    >
      <div
        style={{
          height: 38,
          background: "linear-gradient(180deg, #182032 0%, #121A29 100%)",
          borderBottom: `1px solid ${THEME.panelBorder}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          gap: 8,
        }}
      >
        <span style={dot("#FF5F57")} />
        <span style={dot("#FEBC2E")} />
        <span style={dot("#28C840")} />
        <span
          style={{
            marginLeft: 18,
            fontSize: 13,
            color: THEME.fgDim,
            fontFamily: THEME.fontSans,
            letterSpacing: 0.2,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: "22px 26px", minHeight: 380 }}>{children}</div>
    </div>
  );
};

const dot = (color: string): React.CSSProperties => ({
  display: "inline-block",
  width: 12,
  height: 12,
  borderRadius: 6,
  background: color,
});
