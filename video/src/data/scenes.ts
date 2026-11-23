export type SceneId =
  | "01-hook"
  | "02-problem"
  | "03-reveal"
  | "04-dashboard"
  | "05-masuk"
  | "06-keluar"
  | "07-slot"
  | "08-laporan"
  | "09-aman"
  | "10-cta";

export type Scene = {
  id: SceneId;
  from: number;
  duration: number;
  audio: string;
  label: string;
};

export const scenes: Scene[] = [
  { id: "01-hook", from: 0, duration: 120, audio: "audio/vo/01-hook.mp3", label: "Hook" },
  { id: "02-problem", from: 120, duration: 270, audio: "audio/vo/02-problem.mp3", label: "Masalah" },
  { id: "03-reveal", from: 390, duration: 210, audio: "audio/vo/03-reveal.mp3", label: "Perkenalan" },
  { id: "04-dashboard", from: 600, duration: 255, audio: "audio/vo/04-dashboard.mp3", label: "Dashboard" },
  { id: "05-masuk", from: 855, duration: 270, audio: "audio/vo/05-masuk.mp3", label: "Motor masuk" },
  { id: "06-keluar", from: 1125, duration: 360, audio: "audio/vo/06-keluar.mp3", label: "Motor keluar" },
  { id: "07-slot", from: 1485, duration: 165, audio: "audio/vo/07-slot.mp3", label: "Slot & tarif" },
  { id: "08-laporan", from: 1650, duration: 225, audio: "audio/vo/08-laporan.mp3", label: "Laporan" },
  { id: "09-aman", from: 1875, duration: 180, audio: "audio/vo/09-aman.mp3", label: "Keamanan" },
  { id: "10-cta", from: 2055, duration: 255, audio: "audio/vo/10-cta.mp3", label: "Penutup" },
];

export const TOTAL_FRAMES = 2310;
