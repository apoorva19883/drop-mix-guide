import { useNavigate, useParams } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { getColour, textOn } from "@/data/colours";
import { useMemo, useState } from "react";
import { DropIcon } from "@/components/DropIcon";

const Guide = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const colour = getColour(Number(id));
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());

  if (!colour) return null;

  const steps = useMemo(() => {
    const intro = { title: "Prepare your palette", paint: "Clean palette", drops: 0, hex: "#FFFFFF", instr: "Get a clean palette and brushes ready. We'll mix from light to dark." };
    const ingredientSteps = colour.recipe.ingredients.map((ing, i) => ({
      title: i === 0 ? `Start with ${ing.paint}` : `Add ${ing.paint}`,
      paint: ing.paint, drops: ing.drops, hex: ing.hex,
      instr: i === 0
        ? `Squeeze ${ing.drops} ${ing.drops === 1 ? "drop" : "drops"} of ${ing.paint} as your base.`
        : `Add ${ing.drops} ${ing.drops === 1 ? "drop" : "drops"} of ${ing.paint} and mix gently with a palette knife in a circular motion.`,
    }));
    return [intro, ...ingredientSteps];
  }, [colour]);

  const current = steps[step];
  const total = steps.length;

  // Cumulative preview colour (mix proportionally up to this step)
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

  const markDone = () => {
    setDone(d => new Set(d).add(step));
    if (step < total - 1) setStep(step + 1);
  };

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">Mixing {colour.name}</div>
          <div className="font-display text-lg font-bold">Step {step + 1} of {total}</div>
        </div>
      </header>

      <div className="px-5">
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-lg shadow-pop">{step + 1}</div>
          <h2 className="font-display text-2xl font-bold">{current.title}</h2>
        </div>

        <div className="rounded-2xl bg-primary-soft border border-primary/20 p-5 mb-5">
          {current.drops > 0 && (
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl border border-border shadow-soft" style={{ background: current.hex }} />
              <div>
                <div className="font-semibold">{current.paint}</div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: current.drops }).map((_, i) => (
                    <DropIcon key={i} size={16} color={current.hex} />
                  ))}
                  <span className="ml-1 text-xs font-bold tabular-nums">×{current.drops}</span>
                </div>
              </div>
            </div>
          )}
          <p className="text-sm leading-relaxed">{current.instr}</p>
        </div>

        <div className="surface-card p-5 mb-6">
          <div className="text-xs text-muted-foreground mb-3">Your mix should look like this now</div>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl shadow-soft transition-colors duration-500 border border-border" style={{ background: previewHex }} />
            <div className="flex-1">
              <div className="font-mono text-sm" style={{ color: textOn(previewHex) === "#FFFFFF" ? "hsl(var(--foreground))" : undefined }}>{previewHex}</div>
              {step === total - 1 && <div className="text-xs text-success font-semibold mt-1">✓ Final colour reached</div>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={step === 0}
            onClick={() => setStep(s => Math.max(0, s - 1))}
            className="btn-ghost disabled:opacity-40"
          ><ChevronLeft size={16} /> Back</button>
          {step < total - 1 ? (
            <button onClick={markDone} className="btn-primary">
              {done.has(step) ? <><Check size={16} /> Next</> : <>Done <ChevronRight size={16} /></>}
            </button>
          ) : (
            <button onClick={() => nav("/library")} className="btn-primary"><Check size={16} /> Finish</button>
          )}
        </div>
      </div>
    </MobileShell>
  );
};

export default Guide;
