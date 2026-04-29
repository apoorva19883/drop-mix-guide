import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { ColourWheel } from "@/components/ColourWheel";
import { ProportionBar } from "@/components/ProportionBar";
import { hexToRgb, hslToHex, nearestColour } from "@/data/colours";
import { deleteMix, getMixes, getPrefs, saveMix, setPrefs, SavedMix } from "@/lib/storage";
import { Bookmark, Camera, ChevronRight, Download, Search, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { classifyTemperature, fuzzyFilter, temperatureRank, type Temperature } from "@/lib/search";

const brands = ["Winsor & Newton", "Liquitex", "Golden", "Holbein"];
const SCALES = [1, 2, 3];

const Studio = () => {
  const nav = useNavigate();
  const [hue, setHue] = useState(14);
  const [sat, setSat] = useState(81);
  const [light, setLight] = useState(54);
  const [brand, setBrand] = useState(getPrefs().brand);
  const [mixes, setMixes] = useState<SavedMix[]>([]);
  const [q, setQ] = useState("");
  const [temp, setTemp] = useState<"All" | Temperature>("All");
  const [sort, setSort] = useState<"Recent" | "Name" | "Warm → Cool" | "Cool → Warm">("Recent");
  const [scale, setScale] = useState(1);

  useEffect(() => { setMixes(getMixes()); }, []);

  const hex = useMemo(() => hslToHex(hue, sat, light), [hue, sat, light]);
  const matched = useMemo(() => nearestColour(hex), [hex]);
  const rgb = hexToRgb(hex);

  const filtered = useMemo(() => {
    let list = mixes.map(m => ({ ...m, _temp: classifyTemperature(m.hex) }));
    if (temp !== "All") list = list.filter(m => m._temp === temp);
    list = fuzzyFilter(list, q, m => [m.name, m._temp, m.paintType, m.hex]);
    if (sort === "Name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Warm → Cool") list.sort((a, b) => temperatureRank(a._temp) - temperatureRank(b._temp));
    else if (sort === "Cool → Warm") list.sort((a, b) => temperatureRank(b._temp) - temperatureRank(a._temp));
    else if (!q.trim()) list.sort((a, b) => b.savedAt - a.savedAt);
    return list;
  }, [mixes, q, temp, sort]);

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
        <aside className="bg-surface border border-border rounded-xl p-5 space-y-5 h-fit lg:sticky lg:top-24">
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
        <main className="bg-card border border-border rounded-xl p-8" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
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
            <ProportionBar recipe={matched.recipe} scale={scale} height={64} showLabels />
          </div>

          {/* Scale toggles */}
          <div className="mt-5 flex gap-2">
            {SCALES.map(s => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${scale === s ? "bg-primary text-primary-foreground shadow-pop" : "bg-surface text-foreground hover:bg-border"}`}
              >
                {matched.recipe.total * s} drops {s > 1 && <span className="opacity-70 ml-1">({s}×)</span>}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            {/* Ingredient list with brand + drop count */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ingredients</div>
              <div className="bg-card rounded-xl divide-y divide-border border border-border">
                {matched.recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="h-6 w-6 rounded shrink-0 border border-border" style={{ background: ing.hex }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{ing.paint}</div>
                      <div className="text-[11px] text-muted-foreground">{brand} · Artist series</div>
                    </div>
                    <div className="text-base font-bold text-primary tabular-nums">
                      {ing.drops * scale}<span className="text-[10px] font-medium text-muted-foreground ml-1">drops</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-primary-soft border border-primary/20 p-5">
                <div className="text-2xl mb-2">💡</div>
                <div className="font-semibold mb-1">Always add darker to lighter colours</div>
                <p className="text-sm text-muted-foreground">Start with white, then layer in pigments one drop at a time for total control.</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Brand match accuracy</div>
                <div className="divide-y divide-border">
                  {matched.brands.map(b => {
                    const parts = b.split(" ");
                    const pct = parts[parts.length - 1];
                    const name = parts.slice(0, -1).join(" ");
                    return (
                      <button key={b} className="w-full flex items-center justify-between py-2.5 text-sm hover:bg-surface/60 transition-colors -mx-2 px-2 rounded">
                        <span className="font-medium">{name}</span>
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-success">{pct}</span>
                          <ChevronRight size={14} className="text-muted-foreground" />
                        </span>
                      </button>
                    );
                  })}
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
        <aside className="bg-surface border border-border rounded-xl p-5 space-y-4 h-fit lg:sticky lg:top-24">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Library</div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Fuzzy search…" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow duration-200 ease-out" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["All", "Warm", "Cool", "Neutral"] as const).map(t => {
              const dot = t === "Warm" ? "#E8572A" : t === "Cool" ? "#5B7FBF" : t === "Neutral" ? "#9E9485" : null;
              return (
                <button
                  key={t}
                  onClick={() => setTemp(t)}
                  className={`pill text-[11px] transition-colors ${temp === t ? "bg-primary text-primary-foreground" : "bg-surface border border-border"}`}
                >
                  {dot && <span className="h-2 w-2 rounded-full" style={{ background: dot }} />}
                  {t}
                </button>
              );
            })}
          </div>
          <div className="flex gap-1 flex-wrap text-[11px]">
            {(["Recent", "Name", "Warm → Cool", "Cool → Warm"] as const).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-2 py-1 rounded-full whitespace-nowrap ${sort === s ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:bg-surface"}`}
              >{s}</button>
            ))}
          </div>
          <div className="space-y-2 max-h-[380px] overflow-y-auto -mx-1 px-1">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                {q ? `No matches for "${q}"` : "No saved mixes yet."}
              </div>
            ) : filtered.map(m => (
              <div key={m.id} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-surface transition-colors">
                <button onClick={() => nav(`/recipe/saved-${m.id}`)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                  <div className="h-10 w-10 rounded-lg shadow-soft border border-border shrink-0 relative" style={{ background: m.hex }}>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card" style={{ background: m._temp === "Warm" ? "#E8572A" : m._temp === "Cool" ? "#5B7FBF" : "#9E9485" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.recipe.total} drops · {m.paintType} · {m._temp}</div>
                  </div>
                </button>
                <button onClick={() => { deleteMix(m.id); setMixes(getMixes()); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
            <span className="text-muted-foreground">{filtered.length} of {mixes.length} mixes</span>
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
