export const rupiah = (value: number) =>
  "Rp " + Math.round(value).toLocaleString("id-ID");

export const pad = (value: number, length = 2) =>
  String(value).padStart(length, "0");

export const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h} jam ${pad(m)} mnt ${pad(s)} dtk`;
};
