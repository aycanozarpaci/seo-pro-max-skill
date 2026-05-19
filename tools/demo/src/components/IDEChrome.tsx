import React from "react";
import { THEME } from "../theme";

export const IDEChrome: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        width: 1180,
        height: 660,
        margin: "0 auto",
        background: THEME.panel,
        border: `1px solid ${THEME.panelBorder}`,
        borderRadius: 14,
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        overflow: "hidden",
        fontFamily: THEME.fontMono,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 40,
          background: "#101724",
          borderBottom: `1px solid ${THEME.panelBorder}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          gap: 14,
        }}
      >
        <span style={{ fontSize: 13, color: THEME.fgDim, fontFamily: THEME.fontSans }}>
          Cursor — my-site
        </span>
        <span
          style={{
            marginLeft: "auto",
            marginRight: 16,
            fontSize: 12,
            color: THEME.accent,
            fontFamily: THEME.fontSans,
            background: "rgba(124, 108, 255, 0.12)",
            border: `1px solid ${THEME.accent}40`,
            padding: "4px 10px",
            borderRadius: 8,
          }}
        >
          @seo-pro-max
        </span>
      </div>
      <div style={{ flex: 1, display: "flex" }}>{children}</div>
    </div>
  );
};
