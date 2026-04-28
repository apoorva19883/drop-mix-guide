import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ProportionBar } from "@/components/ProportionBar";
import { colours } from "@/data/colours";
import { setOnboarded, setPrefs, isOnboarded } from "@/lib/storage";
import { ArrowRight, Check } from "lucide-react";

const paintTypes: { id: "Acrylic" | "Oil" | "Watercolour" | "Gouache"; emoji: string; desc: string; popular?: boolean }[] = [
  { id: "Acrylic", emoji: "🎨", desc: "Versatile · fast drying", popular: true },
  { id: "Oil", emoji: "🖌️", desc: "Rich · slow blending" },
  { id: "Watercolour", emoji: "💧", desc: "Translucent · delicate" },
  { id: "Gouache", emoji: "✏️", desc: "Opaque matte finish" },
];

const Onboarding = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [paint, setPaint] = useState<"Acrylic" | "Oil" | "Watercolour" | "Gouache">("Acrylic");
  const demo = colours[0];

  useEffect(() => { if (isOnboarded()) nav("/home"); }, [nav]);

  const finish = () => { setPrefs({ paintType: paint }); setOnboarded(); nav("/home"); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="mx-auto w-full max-w-md flex-1 flex flex-col px-6 pt-10 pb-8">
        <div className="flex items-center justify-between mb-10">
          <Logo to="/onboarding" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <div className="grid grid-cols-2 gap-3 mb-8">
              {colours.slice(0, 4).map((c, i) => (
                <div key={c.id} className="aspect-square rounded-3xl shadow-card animate-drop-in" style={{ background: c.hex, animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight mb-3">
              Scan any colour.<br />Mix it perfectly.<br /><span className="text-primary">In drops.</span>
            </h1>
            <p className="text-muted-foreground mb-auto">Stop guessing percentages. Get exact paint recipes that work on your palette.</p>
            <div className="space-y-3 mt-8">
              <button className="btn-primary w-full" onClick={() => setStep(1)}>Get started <ArrowRight size={18} /></button>
              <button className="w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => setStep(1)}>Sign in</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <h2 className="font-display text-3xl font-bold mb-2">What do you paint with?</h2>
            <p className="text-muted-foreground mb-6">We'll tune recipes to your medium.</p>
            <div className="grid grid-cols-2 gap-3 mb-auto">
              {paintTypes.map(p => {
                const sel = p.id === paint;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPaint(p.id)}
                    className={`relative text-left p-4 rounded-2xl border-2 transition-all bg-card ${sel ? "border-primary shadow-pop" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    {p.popular && <span className="pill absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px]">Most popular</span>}
                    <div className="h-10 w-10 rounded-full bg-surface grid place-items-center text-xl mb-3">{p.emoji}</div>
                    <div className="font-semibold">{p.id}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                    {sel && <Check size={16} className="absolute top-3 right-3 text-primary" />}
                  </button>
                );
              })}
            </div>
            <button className="btn-primary w-full mt-8" onClick={() => setStep(2)}>Continue <ArrowRight size={18} /></button>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <h2 className="font-display text-3xl font-bold mb-2">Your first mix</h2>
            <p className="text-muted-foreground mb-6">This is how every recipe looks.</p>
            <div className="surface-card p-5 mb-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl shadow-soft" style={{ background: demo.hex }} />
                <div>
                  <div className="font-display text-xl font-bold">{demo.name}</div>
                  <div className="text-xs text-muted-foreground">{paint} · {demo.recipe.total} drops total</div>
                </div>
              </div>
              <ProportionBar recipe={demo.recipe} />
              <div className="mt-4 rounded-xl bg-primary-soft p-3 text-xs text-foreground">
                💡 Each segment is sized by drops — never percentages.
              </div>
            </div>
            <button className="btn-primary w-full mt-8" onClick={finish}>Explore MixRight <ArrowRight size={18} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
