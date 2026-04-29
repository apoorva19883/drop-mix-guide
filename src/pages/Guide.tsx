import { useNavigate, useParams } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { getColour, textOn } from "@/data/colours";
import { useMemo, useState } from "react";
import { DropIcon } from "@/components/DropIcon";

const Guide = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const colour = getColour(Number(id));
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());

  const steps = useMemo(() => {
    if (!colour) return [];
    const intro = { title: "Prepare your palette", paint: "Clean palette", drops: 0, hex: "#FFFFFF", instr: "Get a clean palette and brushes ready. We'll mix from light to dark." };
    const ingredientSteps = colour.recipe.ingredients.map((ing, i) => ({
      title: i === 0 ? `Add your first colour` : i === 1 ? `Add your second colour` : `Add ${ing.paint}`,
      paint: ing.paint, drops: ing.drops, hex: ing.hex,
      instr: i === 0
        ? `Squeeze ${ing.drops} ${ing.drops === 1 ? "drop" : "drops"} of ${ing.paint} as your base.`
        : `Add slowly to your ${i === 1 ? "white base" : "mix"}. Mix thoroughly before adding more.`,
    }));
    return [intro, ...ingredientSteps];
  }, [colour]);

  const previewHex = useMemo(() => {
    let r = 0, g = 0, b = 0, w = 0;
    for (let i = 1; i <= step + 1 && i < steps.length; i++) {
      const s = steps[i];
      if (!s.drops) continue;
      const c = parseInt(s.hex.slice(1), 16);
      r += ((c >> 16) & 255) * s.drops;
      g += ((c >> 8) & 255) * s.drops;
      b += (c & 255) * s.drops;
      w += s.drops;
    }
    if (!w) return "#F4F3EF";
    return "#" + [r, g, b].map(v => Math.round(v / w).toString(16).padStart(2, "0")).join("").toUpperCase();
  }, [step, steps]);

  if (!colour) return null;
  const current = steps[step];
  const total = steps.length;

  const markDone = () => {
    setDone(d => new Set(d).add(step));
    if (step < total - 1) setStep(step + 1);
  };

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-3">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">Mixing {colour.name}</div>
        </div>
      </header>

      <div className="px-5">
        {/* Progress */}
        <div className="text-xs font-semibold text-primary mb-2">Step {step + 1} of {total}</div>
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <h2 className="font-display text-[18px] font-bold mb-4">{current.title}</h2>

        {/* Ingredient card */}
        <div className="rounded-xl bg-primary-soft border border-primary/20 p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-lg shadow-pop shrink-0">
              {step + 1}
            </div>
            <div className="flex-1 min-w-0">
              {current.drops > 0 ? (
                <>
                  <div className="font-semibold text-base">{current.paint}</div>
                  <div className="flex items-center gap-1 mt-1.5 mb-2 flex-wrap">
                    {Array.from({ length: current.drops }).map((_, i) => (
                      <DropIcon key={i} size={20} color={current.hex} className="animate-drop-in" />
                    ))}
                    <span className="ml-1.5 text-sm font-bold tabular-nums">{current.drops} {current.drops === 1 ? "drop" : "drops"}</span>
                  </div>
                </>
              ) : (
                <div className="font-semibold text-base mb-2">{current.paint}</div>
              )}
              <p className="text-sm text-foreground/80 leading-relaxed">{current.instr}</p>
            </div>
          </div>
        </div>

        {/* Mix preview */}
        <div className="bg-card rounded-xl p-4 mb-4 flex items-center gap-3" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="text-xs text-muted-foreground flex-1">See mix preview</div>
          <div className="h-10 w-10 rounded-full shadow-soft border border-border transition-colors duration-500" style={{ background: previewHex }} />
          <div className="font-mono text-xs" style={{ color: textOn(previewHex) === "#FFFFFF" ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))" }}>{previewHex}</div>
          {step === total - 1 && <span className="text-xs text-success font-semibold">✓</span>}
        </div>

        {/* Green tip card */}
        <div className="rounded-xl p-4 mb-6 flex items-start gap-3 border" style={{ background: "hsl(var(--success) / 0.08)", borderColor: "hsl(var(--success) / 0.25)" }}>
          <div className="h-9 w-9 rounded-full grid place-items-center shrink-0" style={{ background: "hsl(var(--success))" }}>
            <Lightbulb size={16} className="text-white" />
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-0.5" style={{ color: "hsl(var(--success))" }}>Artist tip</div>
            <div className="text-foreground/80">Add darker colours to lighter ones, never the reverse.</div>
          </div>
        </div>

        {/* Back / Next */}
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={step === 0}
            onClick={() => setStep(s => Math.max(0, s - 1))}
            className="inline-flex items-center justify-center gap-1.5 py-3.5 rounded-lg font-semibold text-primary border-2 border-primary transition-colors hover:bg-primary-soft disabled:opacity-40 disabled:cursor-not-allowed"
          ><ChevronLeft size={16} /> Back</button>
          {step < total - 1 ? (
            <button onClick={markDone} className="inline-flex items-center justify-center gap-1.5 py-3.5 rounded-lg font-semibold bg-primary text-primary-foreground shadow-pop transition-all hover:opacity-95 active:scale-[0.98]">
              {done.has(step) ? <><Check size={16} /> Next</> : <>Next step <ChevronRight size={16} /></>}
            </button>
          ) : (
            <button onClick={() => nav("/library")} className="inline-flex items-center justify-center gap-1.5 py-3.5 rounded-lg font-semibold bg-primary text-primary-foreground shadow-pop"><Check size={16} /> Finish</button>
          )}
        </div>
      </div>
    </MobileShell>
  );
};

export default Guide;
