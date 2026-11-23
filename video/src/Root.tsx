import React from "react";
import { Composition } from "remotion";
import { MotorPark } from "./Video";
import { TOTAL_FRAMES } from "./data/scenes";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MotorPark"
      component={MotorPark}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
