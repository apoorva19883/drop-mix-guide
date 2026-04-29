import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft, Sun, Moon, Sparkles, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { colours, hexToRgb, nearestColour } from "@/data/colours";
import { ProportionBar } from "@/components/ProportionBar";
import { getRecentScans, pushRecentScan, saveMix, getPrefs } from "@/lib/storage";
import { IngredientList } from "@/components/IngredientList";
import { toast } from "sonner";

const Scan = () => {
  const nav = useNavigate();
  const [tab, setTab] = useState<"identify" | "diagnose">("identify");
  const [torch, setTorch] = useState(false);
  const [hex, setHex] = useState(colours[0].hex);
  const [name, setName] = useState(colours[0].name);
  const [scanned, setScanned] = useState<typeof colours[number] | null>(null);
  const [recent, setRecent] = useState(getRecentScans());
  const cycleRef = useRef(0);

  // Live colour cycling
  useEffect(() => {
    const id = setInterval(() => {
      cycleRef.current = (cycleRef.current + 1) % colours.length;
      const c = colours[cycleRef.current];
      setHex(c.hex);
      setName(c.name);
    }, 1600);
    return () => clearInterval(id);
  }, []);

  // Nearby suggestions = 4 closest colours by RGB distance excluding current
  const nearby = useMemo(() => {
    const t = hexToRgb(hex);
    return [...colours]
      .map(c => {
        const r = hexToRgb(c.hex);
        return { c, d: (r.r - t.r) ** 2 + (r.g - t.g) ** 2 + (r.b - t.b) ** 2 };
      })
      .sort((a, b) => a.d - b.d)
      .slice(0, 4)
      .map(x => x.c);
  }, [hex]);

  const handleScan = () => {
    const c = nearestColour(hex);
    setScanned(c);
    pushRecentScan(c.hex, c.name);
    setRecent(getRecentScans());
  };

  const handleSave = () => {
    if (!scanned) return;
    const prefs = getPrefs();
    saveMix({
      colourId: scanned.id, name: scanned.name, hex: scanned.hex,
      paintType: prefs.paintType, recipe: scanned.recipe, brand: prefs.brand,
    });
    toast.success(`${scanned.name} saved to library`);
  };

  return (
    <MobileShell>
      <header className="flex items-center gap-3 px-5 pt-6 pb-3">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><ArrowLeft size={18} /></button>
        <h1 className="font-display text-2xl font-bold">Scan</h1>
      </header>

      <div className="px-5">
        <div className="grid grid-cols-2 p-1 bg-surface rounded-full">
          {(["identify", "diagnose"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 text-sm font-semibold rounded-full transition-all duration-200 ease-out ${tab === t ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"}`}
            >
              {t === "identify" ? "Identify" : "Diagnose"}
            </button>
          ))}
        </div>
      </div>

      {tab === "identify" && (
        <div className="px-5 mt-4 space-y-4">
          {/* Viewfinder — ~70% screen height (mobile ≈ 460px) */}
          <div
            className="relative w-full rounded-3xl overflow-hidden"
            style={{ height: "min(70vh, 520px)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            {/* Solid dark base */}
            <div className="absolute inset-0" style={{ background: "#111111" }} />
            {/* Subtle vignette glow only behind the reticle */}
            <div
              className="absolute inset-0 transition-opacity duration-200 ease-out duration-300 ease-out"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${hex}33 0%, transparent 38%)`,
              }}
            />
            {/* Torch glow when on */}
            {torch && <div className="absolute inset-0 bg-white/5 mix-blend-overlay transition-opacity duration-200 ease-out duration-200 ease-out" />}

            {/* LIVE badge top-left */}
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success text-success-foreground text-[10px] font-bold tracking-wide shadow-card" style={{ animation: "live-pulse 1.6s ease-in-out infinite" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> LIVE
            </div>

            {/* Torch toggle top-right */}
            <button
              onClick={() => setTorch(t => !t)}
              className="absolute top-3 right-3 h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors duration-200 ease-out duration-200 ease-out hover:bg-white/20"
              aria-label="Toggle torch"
            >
              {torch ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Reticle — gradient circle in center */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="relative" style={{ width: 200, height: 200 }}>
                {/* Dashed outer ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-white/90"
                  style={{ animation: "spin-slow 18s linear infinite" }}
                />
                {/* Inner gradient sample disc */}
                <div
                  className="absolute rounded-full border-2 border-white shadow-pop transition-[background] duration-300 ease-out"
                  style={{
                    inset: 30,
                    background: `radial-gradient(circle at 35% 30%, ${hex} 0%, ${hex} 55%, rgba(0,0,0,0.35) 100%)`,
                  }}
                />
                {/* Crosshair */}
                <div className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-white/70" />
                <div className="absolute left-1/2 top-1/2 w-px h-8 -translate-x-1/2 -translate-y-1/2 bg-white/70" />
              </div>
            </div>

            {/* Detected name + hex */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <div className="font-display text-xl font-bold drop-shadow">{name}</div>
              <div className="font-mono text-xs text-white/75 mt-0.5">{hex}</div>
            </div>
          </div>

          {/* Nearby colour suggestions */}
          <div className="flex items-center justify-center gap-3">
            {nearby.map(c => (
              <button
                key={c.id}
                onClick={() => { setHex(c.hex); setName(c.name); }}
                className="h-11 w-11 rounded-full border-2 border-card shadow-soft transition-transform duration-200 ease-out hover:scale-110"
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          <button
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl py-4 shadow-pop transition-all duration-200 ease-out hover:opacity-95 active:scale-[0.98]"
            onClick={handleScan}
          >
            <Sparkles size={18} /> Scan this colour
          </button>

          {recent.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">Recent scans</div>
              <div className="flex gap-2">
                {recent.slice(0, 6).map((r, i) => (
                  <div key={i} className="h-10 w-10 rounded-full border border-border shadow-soft" style={{ background: r.hex }} title={r.name} />
                ))}
              </div>
            </div>
          )}

          {scanned && (
            <div className="rounded-xl bg-card p-5 animate-scale-in" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full shadow-soft" style={{ background: scanned.hex }} />
                <div className="flex-1">
                  <div className="font-display text-xl font-bold">{scanned.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{scanned.hex}</div>
                  <div className="flex gap-1 mt-1.5">
                    {scanned.mood.slice(0, 2).map(m => <span key={m} className="pill bg-surface text-[10px]">{m}</span>)}
                  </div>
                </div>
              </div>
              <ProportionBar recipe={scanned.recipe} />
              <div className="mt-4">
                <IngredientList recipe={scanned.recipe} brand={getPrefs().brand} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button onClick={handleSave} className="btn-ghost">Save to library</button>
                <button onClick={() => nav(`/guide/${scanned.id}`)} className="btn-primary">Mix guide <ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "diagnose" && (
        <div className="px-5 mt-8 text-center">
          <div className="rounded-xl bg-card p-8" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="text-5xl mb-3">🧪</div>
            <h3 className="font-display text-xl font-bold mb-2">Diagnose your mix</h3>
            <p className="text-sm text-muted-foreground mb-5">Point your camera at a mix you've made. We'll tell you what's off and how to correct it.</p>
            <button className="btn-primary w-full" onClick={() => setTab("identify")}>Coming soon — try Identify</button>
          </div>
        </div>
      )}
    </MobileShell>
  );
};

export default Scan;
