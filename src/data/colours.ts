export type PaintType = "Acrylic" | "Oil" | "Watercolour" | "Gouache";

export interface Ingredient {
  paint: string;
  drops: number;
  hex: string;
}

export interface Recipe {
  total: number;
  ingredients: Ingredient[];
}

export interface Colour {
  id: number;
  name: string;
  hex: string;
  category: "Warm" | "Cool" | "Neutral";
  mood: string[];
  recipe: Recipe;
  brands: string[];
}

export const colours: Colour[] = [
  { id: 1, name: "Terracotta Orange", hex: "#E8572A", category: "Warm", mood: ["Energetic", "Warm", "Earthy", "Autumn"], recipe: { total: 10, ingredients: [{ paint: "Titanium White", drops: 6, hex: "#F5E6D3" }, { paint: "Cadmium Red", drops: 3, hex: "#E8572A" }, { paint: "Raw Umber", drops: 1, hex: "#8B4513" }] }, brands: ["Winsor & Newton 98%", "Liquitex 94%"] },
  { id: 2, name: "Forest Deep", hex: "#2E7D52", category: "Cool", mood: ["Calm", "Natural", "Fresh"], recipe: { total: 8, ingredients: [{ paint: "Titanium White", drops: 2, hex: "#F5E6D3" }, { paint: "Phthalo Green", drops: 4, hex: "#2E7D52" }, { paint: "Ivory Black", drops: 2, hex: "#1A1A1A" }] }, brands: ["Winsor & Newton 96%", "Golden 92%"] },
  { id: 3, name: "Sky Dusk", hex: "#5B7FBF", category: "Cool", mood: ["Peaceful", "Dreamy", "Calm"], recipe: { total: 9, ingredients: [{ paint: "Titanium White", drops: 5, hex: "#F5E6D3" }, { paint: "Ultramarine Blue", drops: 3, hex: "#5B7FBF" }, { paint: "Ivory Black", drops: 1, hex: "#1A1A1A" }] }, brands: ["Winsor & Newton 97%", "Liquitex 91%"] },
  { id: 4, name: "Golden Hour", hex: "#F5D76E", category: "Warm", mood: ["Happy", "Sunny", "Warm"], recipe: { total: 8, ingredients: [{ paint: "Titanium White", drops: 3, hex: "#F5E6D3" }, { paint: "Cadmium Yellow", drops: 4, hex: "#F5D76E" }, { paint: "Yellow Ochre", drops: 1, hex: "#C8A84B" }] }, brands: ["Winsor & Newton 95%", "Golden 93%"] },
  { id: 5, name: "Dusty Rose", hex: "#C97B8A", category: "Warm", mood: ["Romantic", "Soft", "Vintage"], recipe: { total: 10, ingredients: [{ paint: "Titanium White", drops: 6, hex: "#F5E6D3" }, { paint: "Cadmium Red", drops: 2, hex: "#E8572A" }, { paint: "Raw Umber", drops: 2, hex: "#8B4513" }] }, brands: ["Winsor & Newton 96%", "Liquitex 90%"] },
  { id: 6, name: "Ocean Deep", hex: "#1A5276", category: "Cool", mood: ["Mysterious", "Deep", "Calm"], recipe: { total: 9, ingredients: [{ paint: "Titanium White", drops: 2, hex: "#F5E6D3" }, { paint: "Prussian Blue", drops: 5, hex: "#1A5276" }, { paint: "Ivory Black", drops: 2, hex: "#1A1A1A" }] }, brands: ["Winsor & Newton 98%", "Golden 94%"] },
  { id: 7, name: "Sage Green", hex: "#87A878", category: "Cool", mood: ["Peaceful", "Natural", "Earthy"], recipe: { total: 10, ingredients: [{ paint: "Titanium White", drops: 5, hex: "#F5E6D3" }, { paint: "Phthalo Green", drops: 3, hex: "#2E7D52" }, { paint: "Yellow Ochre", drops: 2, hex: "#C8A84B" }] }, brands: ["Winsor & Newton 95%", "Liquitex 92%"] },
  { id: 8, name: "Crimson", hex: "#B22222", category: "Warm", mood: ["Passionate", "Bold", "Intense"], recipe: { total: 8, ingredients: [{ paint: "Cadmium Red", drops: 6, hex: "#E8572A" }, { paint: "Alizarin Crimson", drops: 1, hex: "#B22222" }, { paint: "Ivory Black", drops: 1, hex: "#1A1A1A" }] }, brands: ["Winsor & Newton 97%", "Golden 95%"] },
  { id: 9, name: "Lavender Mist", hex: "#9B89C4", category: "Cool", mood: ["Dreamy", "Calm", "Romantic"], recipe: { total: 10, ingredients: [{ paint: "Titanium White", drops: 6, hex: "#F5E6D3" }, { paint: "Ultramarine Blue", drops: 2, hex: "#5B7FBF" }, { paint: "Alizarin Crimson", drops: 2, hex: "#B22222" }] }, brands: ["Winsor & Newton 94%", "Liquitex 91%"] },
  { id: 10, name: "Burnt Sienna", hex: "#8B4513", category: "Warm", mood: ["Earthy", "Warm", "Rustic"], recipe: { total: 8, ingredients: [{ paint: "Cadmium Red", drops: 4, hex: "#E8572A" }, { paint: "Yellow Ochre", drops: 3, hex: "#C8A84B" }, { paint: "Ivory Black", drops: 1, hex: "#1A1A1A" }] }, brands: ["Winsor & Newton 99%", "Golden 96%"] },
  { id: 11, name: "Mint Fresh", hex: "#98D8C8", category: "Cool", mood: ["Fresh", "Clean", "Calm"], recipe: { total: 10, ingredients: [{ paint: "Titanium White", drops: 6, hex: "#F5E6D3" }, { paint: "Phthalo Green", drops: 2, hex: "#2E7D52" }, { paint: "Cerulean Blue", drops: 2, hex: "#5B7FBF" }] }, brands: ["Winsor & Newton 95%", "Liquitex 93%"] },
  { id: 12, name: "Midnight Blue", hex: "#191970", category: "Cool", mood: ["Mysterious", "Deep", "Elegant"], recipe: { total: 9, ingredients: [{ paint: "Ultramarine Blue", drops: 6, hex: "#5B7FBF" }, { paint: "Prussian Blue", drops: 2, hex: "#1A5276" }, { paint: "Ivory Black", drops: 1, hex: "#1A1A1A" }] }, brands: ["Winsor & Newton 97%", "Golden 94%"] },
  { id: 13, name: "Peach Cream", hex: "#FFCBA4", category: "Warm", mood: ["Soft", "Warm", "Gentle"], recipe: { total: 10, ingredients: [{ paint: "Titanium White", drops: 7, hex: "#F5E6D3" }, { paint: "Cadmium Red", drops: 2, hex: "#E8572A" }, { paint: "Cadmium Yellow", drops: 1, hex: "#F5D76E" }] }, brands: ["Winsor & Newton 96%", "Liquitex 92%"] },
  { id: 14, name: "Violet Dusk", hex: "#7B4F9E", category: "Cool", mood: ["Mysterious", "Creative", "Dramatic"], recipe: { total: 9, ingredients: [{ paint: "Ultramarine Blue", drops: 3, hex: "#5B7FBF" }, { paint: "Alizarin Crimson", drops: 4, hex: "#B22222" }, { paint: "Titanium White", drops: 2, hex: "#F5E6D3" }] }, brands: ["Winsor & Newton 95%", "Golden 91%"] },
  { id: 15, name: "Warm Grey", hex: "#9E9485", category: "Neutral", mood: ["Calm", "Sophisticated", "Modern"], recipe: { total: 10, ingredients: [{ paint: "Titanium White", drops: 6, hex: "#F5E6D3" }, { paint: "Ivory Black", drops: 2, hex: "#1A1A1A" }, { paint: "Raw Umber", drops: 2, hex: "#8B4513" }] }, brands: ["Winsor & Newton 98%", "Liquitex 95%"] },
];

export const getColour = (id: number) => colours.find(c => c.id === id);

// Find nearest colour by hex distance
export function nearestColour(hex: string): Colour {
  const target = hexToRgb(hex);
  let best = colours[0];
  let bestD = Infinity;
  for (const c of colours) {
    const r = hexToRgb(c.hex);
    const d = Math.pow(r.r - target.r, 2) + Math.pow(r.g - target.g, 2) + Math.pow(r.b - target.b, 2);
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}

export function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

export function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(255 * f(0), 255 * f(8), 255 * f(4));
}

export function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export const textOn = (hex: string) => relativeLuminance(hex) > 0.55 ? "#1A1A1A" : "#FFFFFF";
