import { Colour, PaintType } from "@/data/colours";

export interface SavedMix {
  id: string;
  colourId?: number;
  name: string;
  hex: string;
  paintType: PaintType;
  recipe: Colour["recipe"];
  brand: string;
  savedAt: number;
}

const KEY_MIXES = "mixright.mixes";
const KEY_PREFS = "mixright.prefs";
const KEY_RECENT_SCANS = "mixright.recentScans";
const KEY_ONBOARDED = "mixright.onboarded";

export interface Prefs {
  paintType: PaintType;
  brand: string;
  name: string;
}

export function getPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(KEY_PREFS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { paintType: "Acrylic", brand: "Winsor & Newton", name: "Artist" };
}
export function setPrefs(p: Partial<Prefs>) {
  const cur = getPrefs();
  localStorage.setItem(KEY_PREFS, JSON.stringify({ ...cur, ...p }));
}

export function getMixes(): SavedMix[] {
  try {
    const raw = localStorage.getItem(KEY_MIXES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
export function saveMix(mix: Omit<SavedMix, "id" | "savedAt">): SavedMix {
  const all = getMixes();
  const created: SavedMix = { ...mix, id: crypto.randomUUID(), savedAt: Date.now() };
  all.unshift(created);
  localStorage.setItem(KEY_MIXES, JSON.stringify(all.slice(0, 200)));
  return created;
}
export function deleteMix(id: string) {
  const all = getMixes().filter(m => m.id !== id);
  localStorage.setItem(KEY_MIXES, JSON.stringify(all));
}

export function getRecentScans(): { hex: string; name: string; at: number }[] {
  try {
    const raw = localStorage.getItem(KEY_RECENT_SCANS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
export function pushRecentScan(hex: string, name: string) {
  const all = getRecentScans().filter(s => s.hex !== hex);
  all.unshift({ hex, name, at: Date.now() });
  localStorage.setItem(KEY_RECENT_SCANS, JSON.stringify(all.slice(0, 8)));
}

export const isOnboarded = () => localStorage.getItem(KEY_ONBOARDED) === "1";
export const setOnboarded = () => localStorage.setItem(KEY_ONBOARDED, "1");
