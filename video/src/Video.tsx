import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { scenes, SceneId, TOTAL_FRAMES } from "./data/scenes";
import { colors, font } from "./theme";

import { S01Hook } from "./scenes/S01Hook";
import { S02Problem } from "./scenes/S02Problem";
import { S03Reveal } from "./scenes/S03Reveal";
import { S04Dashboard } from "./scenes/S04Dashboard";
import { S05Masuk } from "./scenes/S05Masuk";
import { S06Keluar } from "./scenes/S06Keluar";
import { S07Slot } from "./scenes/S07Slot";
import { S08Laporan } from "./scenes/S08Laporan";
import { S09Aman } from "./scenes/S09Aman";
import { S10Cta } from "./scenes/S10Cta";

const sceneComponents: Record<SceneId, React.FC> = {
  "01-hook": S01Hook,
  "02-problem": S02Problem,
  "03-reveal": S03Reveal,
  "04-dashboard": S04Dashboard,
  "05-masuk": S05Masuk,
  "06-keluar": S06Keluar,
  "07-slot": S07Slot,
  "08-laporan": S08Laporan,
  "09-aman": S09Aman,
  "10-cta": S10Cta,
};

export const MotorPark: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily: font }}>
      <Audio src={staticFile("audio/music/bgm.wav")} volume={0.08} />

      {scenes.map((scene) => {
        const SceneComponent = sceneComponents[scene.id];
        return (
          <Sequence
            key={scene.id}
            from={scene.from}
            durationInFrames={scene.duration}
            name={scene.label}
          >
            <SceneComponent />
            <Sequence from={12}>
              <Audio src={staticFile(scene.audio)} />
            </Sequence>
          </Sequence>
        );
      })}

      {scenes.slice(1).map((scene) => (
        <Sequence
          key={`whoosh-${scene.id}`}
          from={Math.max(0, scene.from - 5)}
          durationInFrames={24}
        >
          <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.2} />
        </Sequence>
      ))}

      <Sequence from={955} durationInFrames={20}>
        <Audio src={staticFile("audio/sfx/click.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={970} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/success.wav")} volume={0.32} />
      </Sequence>
      <Sequence from={1350} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/success.wav")} volume={0.32} />
      </Sequence>

      <Sequence from={TOTAL_FRAMES - 30} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/success.wav")} volume={0.18} />
      </Sequence>
    </AbsoluteFill>
  );
};
