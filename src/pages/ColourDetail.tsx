import { useNavigate, useParams } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft } from "lucide-react";
import { colours, getColour, hexToRgb, rgbToHex } from "@/data/colours";
import { ProportionBar } from "@/components/ProportionBar";
import { IngredientList } from "@/components/IngredientList";
import { getPrefs } from "@/lib/storage";

const ColourDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const colour = getColour(Number(id));
  if (!colour) return null;

  // Compute related colour positions
  const r = hexToRgb(colour.hex);
  const complementary = rgbToHex(255 - r.r, 255 - r.g, 255 - r.b);
  const analogous = colours
    .filter(c => c.id !== colour.id && c.category === colour.category)
    .slice(0, 3);
  const triadic = colours.filter((_, i) => i % 5 === colour.id % 5 && _.id !== colour.id).slice(0, 2);

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><ArrowLeft size={18} /></button>
        <h1 className="font-display text-xl font-bold truncate">{colour.name}</h1>
      </header>

      <div className="px-5 pb-8 space-y-6">
        <div className="rounded-3xl shadow-card overflow-hidden h-56 relative" style={{ background: colour.hex }}>
          <div className="absolute bottom-4 left-4 text-white drop-shadow">
            <div className="font-display text-3xl font-bold">{colour.name}</div>
            <div className="font-mono text-sm opacity-90">{colour.hex}</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2">Mood</div>
          <div className="flex flex-wrap gap-2">
            {colour.mood.map(m => <span key={m} className="pill bg-surface border border-border">{m}</span>)}
            <span className="pill bg-card border border-border">{colour.category}</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-3">Colour relationships</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="aspect-square rounded-2xl shadow-soft border border-border mb-2" style={{ background: complementary }} />
              <div className="text-[11px] font-medium">Complementary</div>
            </div>
            {analogous.slice(0, 2).map(a => (
              <button key={a.id} onClick={() => nav(`/colour/${a.id}`)} className="text-center">
                <div className="aspect-square rounded-2xl shadow-soft border border-border mb-2" style={{ background: a.hex }} />
                <div className="text-[11px] font-medium">Analogous</div>
              </button>
            ))}
          </div>
        </div>

        {triadic.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-3">Similar in library</div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {colours.filter(c => c.id !== colour.id).slice(0, 6).map(c => (
                <button key={c.id} onClick={() => nav(`/colour/${c.id}`)} className="shrink-0 w-20 text-left">
                  <div className="h-20 w-20 rounded-2xl shadow-soft border border-border" style={{ background: c.hex }} />
                  <div className="text-[11px] font-medium mt-2 truncate">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="surface-card p-5">
          <div className="font-display text-lg font-bold mb-3">Recipe</div>
          <ProportionBar recipe={colour.recipe} />
          <div className="mt-4">
            <IngredientList recipe={colour.recipe} brand={getPrefs().brand} />
          </div>
        </div>

        <button onClick={() => nav(`/recipe/${colour.id}`)} className="btn-primary w-full">Open full recipe →</button>
      </div>
    </MobileShell>
  );
};

export default ColourDetail;
