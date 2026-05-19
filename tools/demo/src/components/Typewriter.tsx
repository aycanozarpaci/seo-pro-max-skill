import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type Props = {
  text: string;
  startFrame: number;
  endFrame: number;
  cursor?: boolean;
  style?: React.CSSProperties;
};

export const Typewriter: React.FC<Props> = ({
  text,
  startFrame,
  endFrame,
  cursor = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const chars = Math.round(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const visible = text.slice(0, chars);
  const showCursor = cursor && frame >= startFrame && Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={style}>
      {visible}
      {showCursor ? <span style={{ opacity: 0.85 }}>▍</span> : null}
    </span>
  );
};
