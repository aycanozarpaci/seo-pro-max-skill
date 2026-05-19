import React from "react";
import { Composition } from "remotion";
import { Demo } from "./Demo";
import { DURATIONS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SeoProMaxDemo"
        component={Demo}
        durationInFrames={DURATIONS.total}
        fps={DURATIONS.fps}
        width={1280}
        height={720}
      />
    </>
  );
};
