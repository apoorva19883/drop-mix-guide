import { hexToRgb, type Colour } from "@/data/colours";

/**
 * Lightweight fuzzy match score. Returns 0 if no match,
 * higher = better. Handles typos, partial words, and out-of-order chars.
 */
export function fuzzyScore(query: string, target: string): number {
  if (!query) return 1;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();
  if (!q) return 1;

  // Exact / prefix / substring boosts
  if (t === q) return 1000;
  if (t.startsWith(q)) return 600 - (t.length - q.length);
  const idx = t.indexOf(q);
  if (idx !== -1) return 400 - idx - (t.length - q.length) * 0.1;

  // Word-prefix match (e.g. "for" matches "Forest Deep")
  const words = t.split(/\s+/);
  for (const w of words) if (w.startsWith(q)) return 300;

  // Subsequence match: every char of q appears in order in t
  let ti = 0, score = 0, streak = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    streak = found === ti ? streak + 1 : 0;
    score += 10 + streak * 2;
    ti = found + 1;
  }
  return score - (t.length - q.length) * 0.2;
}

/** Sort + filter a list by fuzzy match against name (and optional extras like mood). */
export function fuzzyFilter<T>(items: T[], query: string, getText: (item: T) => string | string[]): T[] {
  if (!query.trim()) return items;
  return items
    .map(item => {
      const fields = getText(item);
      const arr = Array.isArray(fields) ? fields : [fields];
      const best = Math.max(...arr.map(f => fuzzyScore(query, f)));
      return { item, score: best };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.item);
}

/** Classify any hex into Warm / Cool / Neutral using HSL hue + saturation. */
export type Temperature = "Warm" | "Cool" | "Neutral";
export function classifyTemperature(hex: string): Temperature {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : (l > 0.5 ? d / (2 - max - min) : d / (max + min));
  if (s < 0.12) return "Neutral";
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)); break;
      case gn: h = ((bn - rn) / d + 2); break;
      case bn: h = ((rn - gn) / d + 4); break;
    }
    h *= 60;
  }
  // Warm: reds, oranges, yellows, warm browns. Cool: greens, blues, violets.
  if (h < 75 || h >= 320) return "Warm";
  return "Cool";
}

export function temperatureRank(t: Temperature): number {
  return t === "Warm" ? 0 : t === "Neutral" ? 1 : 2;
}

export const colourTemperature = (c: { hex: string; category?: Colour["category"] }): Temperature =>
  (c.category as Temperature) ?? classifyTemperature(c.hex);
