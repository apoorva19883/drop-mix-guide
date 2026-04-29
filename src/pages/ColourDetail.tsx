import { useNavigate, useParams } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft } from "lucide-react";
import { colours, getColour, hexToRgb, rgbToHex } from "@/data/colours";
import { ProportionBar } from "@/components/ProportionBar";
import { useMemo } from "react";

// RGB → HSL helpers
function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)); break;
      case gn: h = ((bn - rn) / d + 2); break;
      case bn: h = ((rn - gn) / d + 4); break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

const ColourDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const colour = getColour(Number(id));

  const related = useMemo(() => {
    if (!colour) return null;
    const r = hexToRgb(colour.hex);
    const complementary = rgbToHex(255 - r.r, 255 - r.g, 255 - r.b);
    const compNearest = colours.reduce((b, c) => {
      const cr = hexToRgb(c.hex);
      const cd = hexToRgb(complementary);
      const d = (cr.r - cd.r) ** 2 + (cr.g - cd.g) ** 2 + (cr.b - cd.b) ** 2;
      return d < b.d ? { c, d } : b;
    }, { c: colours[0], d: Infinity }).c;
    const sameCat = colours.filter(c => c.category === colour.category && c.id !== colour.id);
    return { complementary: compNearest, analogousL: sameCat[0] || colours[0], analogousR: sameCat[1] || colours[1] };
  }, [colour]);

  if (!colour || !related) return null;

  const hsl = hexToHsl(colour.hex);
  const wheelSize = 120;
  // Position marker on wheel edge based on hue (0° = top)
  const markerAngle = (hsl.h - 90) * Math.PI / 180;
  const markerR = wheelSize / 2 - 10;
  const markerX = wheelSize / 2 + Math.cos(markerAngle) * markerR;
  const markerY = wheelSize / 2 + Math.sin(markerAngle) * markerR;

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-3">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><ArrowLeft size={18} /></button>
        <h1 className="font-display text-xl font-bold truncate">{colour.name}</h1>
      </header>

      <div className="px-5 pb-8 space-y-6">
        {/* Header card */}
        <div className="rounded-xl shadow-card overflow-hidden h-56 relative" style={{ background: colour.hex, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="absolute bottom-4 left-4 text-white drop-shadow">
            <div className="font-display text-3xl font-bold">{colour.name}</div>
            <div className="font-mono text-sm opacity-90">{colour.hex}</div>
          </div>
        </div>

        {/* Colour relationships */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Colour relationships</div>
          <div className="bg-card rounded-xl p-5 flex flex-col items-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {/* Conic wheel with marker */}
            <div className="relative" style={{ width: wheelSize, height: wheelSize }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "conic-gradient(from 0deg, hsl(0,90%,55%), hsl(60,90%,55%), hsl(120,80%,45%), hsl(180,80%,45%), hsl(240,80%,55%), hsl(300,80%,55%), hsl(360,90%,55%))" }}
              />
              <div className="absolute rounded-full bg-card" style={{ inset: 22 }} />
              <div
                className="absolute h-5 w-5 rounded-full border-2 border-white shadow-pop"
                style={{ left: markerX - 10, top: markerY - 10, background: colour.hex }}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 w-full">
              {[
                { c: related.complementary, label: "Complementary" },
                { c: related.analogousL, label: "Analogous" },
                { c: related.analogousR, label: "Analogous" },
              ].map((x, i) => (
                <button key={i} onClick={() => nav(`/colour/${x.c.id}`)} className="text-center group">
                  <div className="aspect-square rounded-full shadow-soft border border-border mb-2 mx-auto transition-transform duration-200 ease-out group-hover:scale-105" style={{ background: x.c.hex, maxWidth: 72 }} />
                  <div className="text-[11px] font-semibold">{x.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{x.c.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mood */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Mood</div>
          <div className="flex flex-wrap gap-2">
            {colour.mood.map(m => (
              <span key={m} className="pill bg-primary-soft text-primary border border-primary/20 font-semibold">{m}</span>
            ))}
          </div>
        </div>

        {/* Similar in library */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Similar in library</div>
          <div className="grid grid-cols-3 gap-3">
            {colours.filter(c => c.id !== colour.id).slice(0, 3).map(c => (
              <button key={c.id} onClick={() => nav(`/colour/${c.id}`)} className="text-left group">
                <div className="aspect-square rounded-xl shadow-soft border border-border mb-2 transition-transform duration-200 ease-out group-hover:-translate-y-0.5" style={{ background: c.hex }} />
                <div className="text-[11px] font-semibold truncate">{c.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recipe preview */}
        <div className="bg-card rounded-xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="font-display text-lg font-bold mb-3">Recipe</div>
          <ProportionBar recipe={colour.recipe} />
        </div>

        <button onClick={() => nav(`/recipe/${colour.id}`)} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl py-4 shadow-pop transition-all duration-200 ease-out hover:opacity-95 active:scale-[0.98]">
          View full recipe →
        </button>
      </div>
    </MobileShell>
  );
};

export default ColourDetail;
