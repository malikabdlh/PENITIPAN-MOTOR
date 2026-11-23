import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, font } from "../theme";
import { clamp } from "../lib/motion";

export const MiniBars: React.FC<{
  data: number[];
  labels?: string[];
  height?: number;
  delay?: number;
  accent?: string;
}> = ({ data, labels, height = 150, delay = 0, accent = colors.red }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height }}>
        {data.map((value, index) => {
          const progress = interpolate(
            frame - delay - index * 2,
            [0, 20],
            [0, 1],
            clamp
          );
          const h = (value / max) * progress;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${Math.max(3, h * 100)}%`,
                  background: index === data.length - 1 ? accent : "#D5DADF",
                  borderRadius: "4px 4px 0 0",
                }}
              />
            </div>
          );
        })}
      </div>
      {labels ? (
        <div style={{ display: "flex", gap: 12 }}>
          {labels.map((label, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 10.5,
                color: colors.muted,
                fontFamily: font,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const LineChart: React.FC<{
  data: number[];
  width?: number;
  height?: number;
  delay?: number;
}> = ({ data, width = 460, height = 140, delay = 0 }) => {
  const frame = useCurrentFrame();
  const pad = 6;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const points = data.map((value, index) => {
    const x = pad + (index / Math.max(1, data.length - 1)) * (width - pad * 2);
    const y =
      height - pad - ((value - min) / Math.max(1, max - min)) * (height - pad * 2);
    return { x, y };
  });
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${path} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;
  const progress = interpolate(frame - delay, [0, 34], [0, 1], clamp);
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={area} fill="rgba(30,132,73,.08)" />
      <path
        d={path}
        fill="none"
        stroke={colors.green}
        strokeWidth={2.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 4 : 2.4}
          fill={i === points.length - 1 ? colors.green : "#fff"}
          stroke={colors.green}
          strokeWidth={1.6}
          opacity={progress > 0.9 ? 1 : 0}
        />
      ))}
    </svg>
  );
};

export const Donut: React.FC<{
  value: number;
  size?: number;
  label?: string;
}> = ({ value, size = 96, label }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 30], [0, value], clamp);
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#EAEDED"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colors.red}
          strokeWidth={8}
          strokeDasharray={`${(progress / 100) * c} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: font,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: colors.ink }}>
          {Math.round(progress)}%
        </div>
        {label ? (
          <div style={{ fontSize: 10, color: colors.muted }}>{label}</div>
        ) : null}
      </div>
    </div>
  );
};
