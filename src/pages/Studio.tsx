import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { ColourWheel } from "@/components/ColourWheel";
import { ProportionBar } from "@/components/ProportionBar";
import { IngredientList } from "@/components/IngredientList";
import { hexToRgb, hslToHex, nearestColour } from "@/data/colours";
import { deleteMix, getMixes, getPrefs, saveMix, setPrefs, SavedMix } from "@/lib/storage";
import { Bookmark, Camera, Download, Search, Trash2, User } from "lucide-react";
import { toast } from "sonner";

const brands = ["Winsor & Newton", "Liquitex", "Golden", "Holbein"];

const Studio = () => {
  const nav = useNavigate();
  const [hue, setHue] = useState(14);
  const [sat, setSat] = useState(81);
  const [light, setLight] = useState(54);
  const [brand, setBrand] = useState(getPrefs().brand);
  const [mixes, setMixes] = useState<SavedMix[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => { setMixes(getMixes()); }, []);

  const hex = useMemo(() => hslToHex(hue, sat, light), [hue, sat, light]);
  const matched = useMemo(() => nearestColour(hex), [hex]);
  const rgb = hexToRgb(hex);

  const filtered = mixes.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));

  const handleSave = () => {
    const prefs = getPrefs();
    saveMix({ colourId: matched.id, name: matched.name, hex: matched.hex, paintType: prefs.paintType, recipe: matched.recipe, brand });
    setMixes(getMixes());
    toast.success(`${matched.name} saved`);
  };

  const handleBrand = (b: string) => { setBrand(b); setPrefs({ brand: b }); };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="border-b border-border bg-card/70 backdrop-blur sticky top-0 z-30 no-print">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo to="/studio" />
            <nav className="flex gap-1">
              {[
                { to: "/home", l: "Home" },
                { to: "/studio", l: "Studio" },
                { to: "/library", l: "Library" },
                { to: "/picker", l: "Learn" },
              ].map(n => (
                <button key={n.to} onClick={() => nav(n.to)} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface transition-colors">{n.l}</button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-surface"><Search size={16} /></button>
            <button onClick={() => window.print()} className="btn-primary !py-2 !px-4 text-sm"><Download size={14} /> Export PDF</button>
            <div className="h-9 w-9 rounded-full bg-surface grid place-items-center"><User size={16} /></div>
          </div>
        </div>
      </header>

      {/* Three panel layout */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 grid gap-6 lg:grid-cols-[280px_1fr_240px]">
        {/* LEFT */}
        <aside className="surface-card p-5 space-y-5 h-fit lg:sticky lg:top-24">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Colour Wheel</div>
            <div className="flex justify-center"><ColourWheel size={220} hue={hue} saturation={sat} onChange={(h, s) => { setHue(h); setSat(s); }} /></div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-muted-foreground">Brightness</span>
              <span className="tabular-nums">{light}%</span>
            </div>
            <input type="range" min={5} max={95} value={light} onChange={e => setLight(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #000, ${hslToHex(hue, sat, 50)}, #fff)` }} />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Selected</div>
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 rounded-2xl shadow-soft border border-border" style={{ background: hex }} />
              <div className="text-xs">
                <div className="font-mono font-bold">{hex}</div>
                <div className="text-muted-foreground mt-1">RGB {rgb.r}, {rgb.g}, {rgb.b}</div>
                <div className="mt-1">≈ <span className="font-semibold">{matched.name}</span></div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Brand</div>
            <select value={brand} onChange={e => handleBrand(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <button onClick={() => nav(`/recipe/${matched.id}`)} className="btn-primary w-full">Get drop recipe</button>
        </aside>

        {/* CENTER */}
        <main className="surface-card p-8">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Drop Recipe</div>
          <div className="flex items-end justify-between gap-4 mb-1 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl shadow-soft border border-border" style={{ background: matched.hex }} />
              <div>
                <h1 className="font-display text-3xl font-bold">{matched.name}</h1>
                <p className="text-sm text-muted-foreground">{getPrefs().paintType} · {matched.recipe.total} drops total · {brand}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matched.mood.map(m => <span key={m} className="pill bg-surface border border-border">{m}</span>)}
            </div>
          </div>

          <div className="mt-6">
            <ProportionBar recipe={matched.recipe} height={64} showLabels />
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-8">
            <IngredientList recipe={matched.recipe} brand={brand} />
            <div className="space-y-3">
              <div className="rounded-2xl bg-primary-soft border border-primary/20 p-5">
                <div className="text-2xl mb-2">💡</div>
                <div className="font-semibold mb-1">{matched.recipe.total} drops total</div>
                <p className="text-sm text-muted-foreground">Need a larger batch? Multiply every drop count by 2 or 3 — the proportions stay perfect.</p>
              </div>
              <div className="rounded-2xl bg-surface p-5">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Brand match accuracy</div>
                <div className="space-y-2">
                  {matched.brands.map(b => (
                    <div key={b} className="flex items-center justify-between text-sm">
                      <span>{b.split(" ").slice(0, -1).join(" ")}</span>
                      <span className="font-semibold text-success">{b.split(" ").slice(-1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 no-print">
            <button onClick={() => window.print()} className="btn-primary"><Download size={16} /> Print drop recipe PDF</button>
            <button onClick={handleSave} className="btn-ghost"><Bookmark size={16} /> Save to library</button>
          </div>
        </main>

        {/* RIGHT */}
        <aside className="surface-card p-5 space-y-4 h-fit lg:sticky lg:top-24">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Library</div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="space-y-2 max-h-[440px] overflow-y-auto -mx-1 px-1">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">No saved mixes yet.</div>
            ) : filtered.map(m => (
              <div key={m.id} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-colors">
                <button onClick={() => nav(`/recipe/saved-${m.id}`)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                  <div className="h-10 w-10 rounded-lg shadow-soft border border-border shrink-0" style={{ background: m.hex }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.recipe.total} drops · {m.paintType}</div>
                  </div>
                </button>
                <button onClick={() => { deleteMix(m.id); setMixes(getMixes()); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
            <span className="text-muted-foreground">{mixes.length} mixes saved</span>
          </div>
          <button onClick={() => nav("/scan")} className="w-full text-sm font-semibold text-primary hover:bg-primary-soft py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5">
            <Camera size={14} /> Scan new colour +
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Studio;
