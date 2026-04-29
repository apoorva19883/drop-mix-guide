import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProportionBar } from "@/components/ProportionBar";
import { colours } from "@/data/colours";
import { setOnboarded, setPrefs, isOnboarded } from "@/lib/storage";
import { ArrowRight, Check, Camera, BookOpen } from "lucide-react";

type PaintId = "Acrylic" | "Oil" | "Watercolour" | "Gouache";

const paintTypes: { id: PaintId; desc: string; tint: string; popular?: boolean }[] = [
  { id: "Acrylic", desc: "Versatile · fast drying", tint: "#E8572A", popular: true },
  { id: "Oil", desc: "Rich · slow blending", tint: "#1A1A1A" },
  { id: "Watercolour", desc: "Translucent · delicate", tint: "#5B7FBF" },
  { id: "Gouache", desc: "Opaque matte finish", tint: "#2E7D52" },
];

const Onboarding = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [paint, setPaint] = useState<PaintId>("Acrylic");
  const demo = colours[0];

  useEffect(() => { if (isOnboarded()) nav("/home"); }, [nav]);

  const finish = () => { setPrefs({ paintType: paint }); setOnboarded(); nav("/home"); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col px-6 pt-10 pb-8">
        <div className="flex items-center justify-end mb-8">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
        </div>

        {/* SCREEN 1 — Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center text-center animate-fade-up">
            <div
              className="h-20 w-20 rounded-full grid place-items-center shadow-pop mb-6 animate-drop-in"
              style={{ background: "#E8572A" }}
            >
              <span className="font-display text-white text-3xl font-bold leading-none">M</span>
            </div>

            <h1 className="font-display text-[28px] font-bold text-foreground tracking-tight">MixRight</h1>
            <p className="text-muted-foreground mt-2 mb-8">Scan any colour. Mix it in drops.</p>

            {/* Animated colour circles */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-16 w-16 rounded-full shadow-card" style={{ animation: "hue-shift 4s ease-in-out infinite" }} />
              <div className="h-20 w-20 rounded-full shadow-card" style={{ animation: "hue-shift-2 4s ease-in-out infinite" }} />
              <div className="h-16 w-16 rounded-full shadow-card" style={{ animation: "hue-shift-3 4s ease-in-out infinite" }} />
            </div>

            <p className="text-sm text-muted-foreground mb-auto max-w-xs">
              Stop guessing percentages. Get exact paint recipes that work on your palette.
            </p>

            <div className="w-full space-y-3 mt-8">
              <button
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl py-4 text-base shadow-pop transition-all hover:opacity-95 active:scale-[0.98]"
                onClick={() => setStep(1)}
              >
                <Camera size={18} /> Scan a colour
              </button>
              <button className="w-full text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1.5" onClick={() => { setOnboarded(); nav("/library"); }}>
                <BookOpen size={14} /> Browse my mixes
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2 — Paint type */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <h2 className="font-display text-[20px] font-bold mb-1">What paint do you use?</h2>
            <p className="text-sm text-muted-foreground mb-6">We'll tailor recipes to your medium.</p>
            <div className="grid grid-cols-2 gap-3 mb-auto">
              {paintTypes.map(p => {
                const sel = p.id === paint;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPaint(p.id)}
                    className={`relative text-left p-4 rounded-xl bg-card transition-all duration-300 ${
                      sel ? "ring-2 ring-primary shadow-pop" : "ring-1 ring-border hover:ring-muted-foreground/40"
                    }`}
                    style={{ boxShadow: sel ? undefined : "0 2px 12px rgba(0,0,0,0.06)" }}
                  >
                    {p.popular && (
                      <span className="absolute -top-2 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        Popular
                      </span>
                    )}
                    <div
                      className="h-10 w-10 rounded-full mb-3 transition-transform"
                      style={{ background: p.tint, transform: sel ? "scale(1.05)" : "scale(1)" }}
                    />
                    <div className="font-semibold text-[15px]">{p.id}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                    {sel && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center animate-scale-in">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl py-4 mt-8 shadow-pop transition-all hover:opacity-95 active:scale-[0.98]"
              onClick={() => setStep(2)}
            >
              Continue with {paint} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* SCREEN 3 — Preview */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <h2 className="font-display text-[20px] font-bold mb-1">Your first mix</h2>
            <p className="text-sm text-muted-foreground mb-6">This is how every recipe looks.</p>
            <div className="bg-card rounded-xl p-5 mb-auto" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full shadow-soft" style={{ background: demo.hex }} />
                <div>
                  <div className="font-display text-xl font-bold">{demo.name}</div>
                  <div className="text-xs text-muted-foreground">{paint} · {demo.recipe.total} drops total</div>
                </div>
              </div>
              <ProportionBar recipe={demo.recipe} />
              <div className="mt-4 rounded-xl bg-primary-soft p-3 text-xs">
                💡 Each segment is sized by drops — never percentages.
              </div>
            </div>
            <button
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl py-4 mt-8 shadow-pop transition-all hover:opacity-95 active:scale-[0.98]"
              onClick={finish}
            >
              Explore MixRight <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
