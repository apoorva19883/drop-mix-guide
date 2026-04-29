import { useNavigate, useParams } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft, Bookmark, Printer, ChevronRight, ChevronRightCircle } from "lucide-react";
import { getColour } from "@/data/colours";
import { ProportionBar } from "@/components/ProportionBar";
import { IngredientList } from "@/components/IngredientList";
import { useState } from "react";
import { getMixes, getPrefs, saveMix } from "@/lib/storage";
import { toast } from "sonner";

const Recipe = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [scale, setScale] = useState(1);
  const prefs = getPrefs();

  const colour = id?.startsWith("saved-") ? null : getColour(Number(id));
  const savedMix = !colour ? getMixes().find(m => `saved-${m.id}` === id) || null : null;
  const data = colour
    ? { name: colour.name, hex: colour.hex, recipe: colour.recipe, brand: colour.brands[0], colourId: colour.id, brands: colour.brands }
    : savedMix
      ? { name: savedMix.name, hex: savedMix.hex, recipe: savedMix.recipe, brand: savedMix.brand, colourId: savedMix.colourId, brands: [savedMix.brand + " 96%", "Liquitex 92%"] }
      : null;

  if (!data) return (
    <MobileShell>
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Recipe not found.</p>
        <button onClick={() => nav("/home")} className="btn-primary mt-4">Go home</button>
      </div>
    </MobileShell>
  );

  const handleSave = () => {
    saveMix({ colourId: data.colourId, name: data.name, hex: data.hex, paintType: prefs.paintType, recipe: data.recipe, brand: data.brand });
    toast.success("Saved to library ✓");
  };

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pt-6 pb-2 no-print">
        <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold">
          <ArrowLeft size={16} /> Back to scan
        </button>
        <button onClick={() => window.print()} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><Printer size={16} /></button>
      </header>

      <div className="px-5 pt-2 pb-8 space-y-6">
        {/* Header swatch + title */}
        <div className="flex items-center gap-4">
          <div className="h-[60px] w-[60px] rounded-full shadow-card border border-border animate-scale-in shrink-0" style={{ background: data.hex }} />
          <div className="min-w-0">
            <h1 className="font-display text-[22px] font-bold leading-tight truncate">{data.name}</h1>
            <p className="text-sm text-muted-foreground">{prefs.paintType} · {data.recipe.total * scale} drops total</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{data.hex}</p>
          </div>
        </div>

        {/* Proportion bar */}
        <ProportionBar recipe={data.recipe} scale={scale} height={56} showLabels />

        {/* Ingredients */}
        <IngredientList recipe={data.recipe} scale={scale} brand={data.brand} />

        {/* Scale toggles */}
        <div className="bg-card rounded-xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Batch size</div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(s => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`py-2.5 rounded-xl font-semibold text-sm transition-all ${scale === s ? "bg-primary text-primary-foreground shadow-pop" : "bg-surface text-foreground hover:bg-border"}`}
              >
                {data.recipe.total * s} drops
              </button>
            ))}
          </div>
        </div>

        {/* Brand matches */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Paint brand matches</div>
          <div className="bg-card rounded-xl divide-y divide-border" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {data.brands.map((b, i) => {
              const parts = b.split(" ");
              const pct = parts[parts.length - 1];
              const brandName = parts.slice(0, -1).join(" ");
              return (
                <button key={i} className="w-full flex items-center gap-3 p-4 hover:bg-surface/60 transition-colors text-left">
                  <div className="h-10 w-10 rounded-full bg-surface grid place-items-center font-bold text-sm shrink-0">
                    {brandName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{brandName}</div>
                    <div className="text-xs text-muted-foreground">Artist series</div>
                  </div>
                  <span className="text-sm font-bold text-success">{pct} match</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="rounded-xl bg-primary-soft border border-primary/20 p-4 flex gap-3">
          <div className="text-2xl">💡</div>
          <div className="text-sm">
            <div className="font-semibold mb-0.5">Pro tip</div>
            <div className="text-muted-foreground">Always start with white as your base, then add darker pigments one drop at a time.</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 no-print">
          <button onClick={handleSave} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl py-4 shadow-pop transition-all hover:opacity-95 active:scale-[0.98]">
            <Bookmark size={16} /> Save to my mixes
          </button>
          {data.colourId && (
            <button onClick={() => nav(`/guide/${data.colourId}`)} className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-4 font-semibold text-primary border-2 border-primary transition-colors hover:bg-primary-soft">
              Step by step guide <ChevronRightCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </MobileShell>
  );
};

export default Recipe;
