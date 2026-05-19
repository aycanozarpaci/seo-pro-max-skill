import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Terminal } from "./scenes/Terminal";
import { Transition } from "./scenes/Transition";
import { IDE } from "./scenes/IDE";
import { Outro } from "./scenes/Outro";
import { DURATIONS } from "./theme";

const { terminal, transition, ide, outro } = DURATIONS;
const T_START = 0;
const TR_START = terminal;                              // 90
const I_START = terminal + transition;                  // 120
const O_START = terminal + transition + ide;            // 210

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#0B0F17" }}>
      <Sequence from={T_START} durationInFrames={terminal}>
        <Terminal localFrame={frame - T_START} />
      </Sequence>

      <Sequence from={TR_START} durationInFrames={transition}>
        <Transition localFrame={frame - TR_START} />
      </Sequence>

      <Sequence from={I_START} durationInFrames={ide}>
        <IDE localFrame={frame - I_START} />
      </Sequence>

      <Sequence from={O_START} durationInFrames={outro}>
        <Outro localFrame={frame - O_START} />
      </Sequence>
    </AbsoluteFill>
  );
};
