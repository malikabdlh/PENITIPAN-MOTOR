import fs from "node:fs";
import path from "node:path";

const SR = 44100;

const writeWav = (file, samples, sampleRate = SR) => {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
};

const smooth = (x) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

/* ---------- Musik latar: pad lembut, progresi Am - F - C - G ---------- */
const chords = [
  [110.0, 220.0, 261.63, 329.63],
  [87.31, 174.61, 220.0, 261.63],
  [130.81, 261.63, 329.63, 392.0],
  [98.0, 196.0, 246.94, 293.66],
  [110.0, 220.0, 261.63, 329.63],
  [87.31, 174.61, 220.0, 261.63],
  [130.81, 261.63, 329.63, 392.0],
  [98.0, 196.0, 246.94, 293.66],
  [110.0, 220.0, 261.63, 329.63],
  [87.31, 174.61, 220.0, 261.63],
];
const totalSeconds = 78;
const music = new Float32Array(totalSeconds * SR);
const chordSpan = 8;
const chordLen = 9.5;

chords.forEach((freqs, index) => {
  const start = index * chordSpan;
  const length = Math.min(chordLen, totalSeconds - start);
  for (let i = 0; i < length * SR; i++) {
    const t = i / SR;
    const env = smooth(t / 1.8) * smooth((length - t) / 1.8);
    let v = 0;
    freqs.forEach((f, fi) => {
      const amp = fi === 0 ? 0.055 : 0.045;
      v += Math.sin(2 * Math.PI * f * t + fi * 0.6) * amp;
      v += Math.sin(2 * Math.PI * f * 1.004 * t) * amp * 0.25;
    });
    // getaran sangat halus agar tidak statis
    v *= 0.9 + 0.1 * Math.sin(2 * Math.PI * 0.09 * t + index);
    music[Math.floor(start * SR) + i] += v * env;
  }
});
// fade awal dan akhir
for (let i = 0; i < music.length; i++) {
  const t = i / SR;
  const fadeIn = smooth(t / 3);
  const fadeOut = smooth((totalSeconds - t) / 5);
  music[i] *= Math.min(1, fadeIn, fadeOut) * 0.55;
}
writeWav("public/audio/music/bgm.wav", music);

/* ---------- Whoosh transisi ---------- */
const whooshLen = 0.8;
const whoosh = new Float32Array(whooshLen * SR);
let low = 0;
for (let i = 0; i < whoosh.length; i++) {
  const t = i / SR;
  const p = t / whooshLen;
  const cutoff = 0.02 + 0.22 * Math.sin(Math.PI * p);
  const noise = Math.random() * 2 - 1;
  low += cutoff * (noise - low);
  const env = Math.sin(Math.PI * Math.pow(p, 0.65)) * (1 - p * 0.35);
  whoosh[i] = low * env * 0.9;
}
writeWav("public/audio/sfx/whoosh.wav", whoosh);

/* ---------- Click ---------- */
const clickLen = 0.12;
const click = new Float32Array(clickLen * SR);
for (let i = 0; i < click.length; i++) {
  const t = i / SR;
  const env = Math.exp(-t * 55);
  click[i] =
    (Math.sin(2 * Math.PI * 1500 * t) * 0.5 +
      (Math.random() * 2 - 1) * 0.2) *
    env;
}
writeWav("public/audio/sfx/click.wav", click);

/* ---------- Chime sukses ---------- */
const chimeLen = 1.1;
const chime = new Float32Array(chimeLen * SR);
const notes = [
  { f: 659.25, at: 0.0, len: 0.5, amp: 0.5 },
  { f: 880.0, at: 0.14, len: 0.7, amp: 0.42 },
];
for (const note of notes) {
  const start = Math.floor(note.at * SR);
  const len = Math.floor(note.len * SR);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 6.5) * smooth(t / 0.01);
    const v =
      Math.sin(2 * Math.PI * note.f * t) * 0.7 +
      Math.sin(2 * Math.PI * note.f * 2 * t) * 0.2 +
      Math.sin(2 * Math.PI * note.f * 3 * t) * 0.08;
    chime[start + i] += v * env * note.amp;
  }
}
writeWav("public/audio/sfx/success.wav", chime);

console.log("Audio selesai dibuat.");
