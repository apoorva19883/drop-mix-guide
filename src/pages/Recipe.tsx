import { useNavigate, useParams } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft, Bookmark, Printer } from "lucide-react";
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

  let colour = id?.startsWith("saved-") ? null : getColour(Number(id));
  let savedMix = null as ReturnType<typeof getMixes>[number] | null;
  if (!colour) {
    savedMix = getMixes().find(m => `saved-${m.id}` === id) || null;
  }
  const data = colour
    ? { name: colour.name, hex: colour.hex, recipe: colour.recipe, brand: colour.brands[0], colourId: colour.id }
    : savedMix
      ? { name: savedMix.name, hex: savedMix.hex, recipe: savedMix.recipe, brand: savedMix.brand, colourId: savedMix.colourId }
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
    toast.success("Saved to library");
  };

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pt-6 pb-2 no-print">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><ArrowLeft size={18} /></button>
        <button onClick={() => window.print()} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><Printer size={16} /></button>
      </header>

      <div className="px-5 pt-2 pb-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full shadow-card border border-border animate-scale-in" style={{ background: data.hex }} />
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">{data.name}</h1>
            <p className="text-sm text-muted-foreground">{prefs.paintType} · {data.recipe.total * scale} drops total</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{data.hex}</p>
          </div>
        </div>

        <ProportionBar recipe={data.recipe} scale={scale} height={56} showLabels />

        <IngredientList recipe={data.recipe} scale={scale} brand={data.brand} />

        <div className="surface-card p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2">Need more?</div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(s => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`py-2.5 rounded-xl font-semibold text-sm transition-all ${scale === s ? "bg-primary text-primary-foreground shadow-pop" : "bg-surface text-foreground hover:bg-border"}`}
              >
                {s}× <span className="text-[10px] opacity-70">({data.recipe.total * s} drops)</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-primary-soft border border-primary/20 p-4 flex gap-3">
          <div className="text-2xl">💡</div>
          <div className="text-sm">
            <div className="font-semibold mb-0.5">Pro tip</div>
            <div className="text-muted-foreground">Always start with white as your base, then add darker pigments one drop at a time.</div>
          </div>
        </div>

        <div className="space-y-3 no-print">
          {data.colourId && (
            <button onClick={() => nav(`/guide/${data.colourId}`)} className="btn-primary w-full">Start step by step guide →</button>
          )}
          <button onClick={handleSave} className="btn-ghost w-full"><Bookmark size={16} /> Save to library</button>
        </div>
      </div>
    </MobileShell>
  );
};

export default Recipe;
