import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const useEnter = (delay = 0, distance = 26) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - delay);
  const progress = spring({
    frame: local,
    fps,
    config: { damping: 200, mass: 0.7, stiffness: 120 },
    durationInFrames: 28,
  });
  const opacity = interpolate(frame - delay, [0, 14], [0, 1], clamp);
  return {
    opacity,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};

export const usePop = (delay = 0, from = 0.9) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 140 },
    durationInFrames: 30,
  });
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], clamp);
  return { opacity, transform: `scale(${from + (1 - from) * progress})` };
};

export const useFadeOut = (duration: number, length = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [duration - length, duration], [1, 0], clamp);
};

export const useSlide = (
  delay: number,
  fromX = 40,
  fromY = 0,
  duration = 30
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 200, mass: 0.8, stiffness: 110 },
    durationInFrames: duration,
  });
  const opacity = interpolate(frame - delay, [0, 14], [0, 1], clamp);
  return {
    opacity,
    transform: `translate(${(1 - progress) * fromX}px, ${
      (1 - progress) * fromY
    }px)`,
  };
};

export const useCountUp = (target: number, delay = 0, duration = 26) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], clamp);
  return Math.round(target * progress);
};

export const typed = (text: string, frame: number, start: number, speed = 1.4) => {
  const count = Math.floor(Math.max(0, frame - start) * speed);
  return text.slice(0, Math.min(text.length, count));
};
