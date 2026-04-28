import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { ColourWheel } from "@/components/ColourWheel";
import { hexToRgb, hslToHex, nearestColour } from "@/data/colours";
import { ProportionBar } from "@/components/ProportionBar";

const Picker = () => {
  const nav = useNavigate();
  const [hue, setHue] = useState(20);
  const [sat, setSat] = useState(75);
  const [light, setLight] = useState(54);
  const [hexInput, setHexInput] = useState("");

  const hex = useMemo(() => hslToHex(hue, sat, light), [hue, sat, light]);
  const matched = useMemo(() => nearestColour(hex), [hex]);
  const rgb = hexToRgb(hex);

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><ArrowLeft size={18} /></button>
        <h1 className="font-display text-2xl font-bold">Pick a colour</h1>
      </header>

      <div className="px-5 space-y-5">
        <div className="flex justify-center">
          <ColourWheel size={260} hue={hue} saturation={sat} onChange={(h, s) => { setHue(h); setSat(s); }} />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-muted-foreground">Brightness</span>
            <span className="tabular-nums">{light}%</span>
          </div>
          <input
            type="range" min={5} max={95} value={light}
            onChange={e => setLight(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #000, ${hslToHex(hue, sat, 50)}, #fff)` }}
          />
        </div>

        <div className="surface-card p-4 flex items-center gap-4">
          <div className="h-20 w-20 rounded-2xl shadow-soft border border-border" style={{ background: hex }} />
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-bold truncate">{matched.name}</div>
            <div className="text-xs text-muted-foreground font-mono">{hex}</div>
            <div className="text-[11px] text-muted-foreground mt-1">RGB {rgb.r}, {rgb.g}, {rgb.b}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text" placeholder="Enter hex e.g. #E8572A"
            value={hexInput}
            onChange={e => setHexInput(e.target.value)}
            onBlur={() => {
              const v = hexInput.trim().replace(/^#?/, "#");
              if (/^#[0-9a-f]{6}$/i.test(v)) {
                const c = nearestColour(v);
                const m = nearestColour(v);
                // Decompose to HSL approximate via match
                const r = hexToRgb(v);
                // simple RGB->HSL
                const rn = r.r/255, gn = r.g/255, bn = r.b/255;
                const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
                let h = 0, s = 0; const l = (max+min)/2;
                if (max !== min) {
                  const d = max - min;
                  s = l > 0.5 ? d/(2-max-min) : d/(max+min);
                  switch(max) {
                    case rn: h = ((gn-bn)/d + (gn<bn?6:0)); break;
                    case gn: h = ((bn-rn)/d + 2); break;
                    case bn: h = ((rn-gn)/d + 4); break;
                  }
                  h *= 60;
                }
                setHue(Math.round(h)); setSat(Math.round(s*100)); setLight(Math.round(l*100));
                void c; void m;
              }
            }}
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <ProportionBar recipe={matched.recipe} />

        <button onClick={() => nav(`/recipe/${matched.id}`)} className="btn-primary w-full">Use this colour →</button>
      </div>
    </MobileShell>
  );
};

export default Picker;
