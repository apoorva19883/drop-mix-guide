import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { ArrowLeft, Zap, ZapOff, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { colours, nearestColour } from "@/data/colours";
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

  // Simulate live colour detection
  useEffect(() => {
    const id = setInterval(() => {
      cycleRef.current = (cycleRef.current + 1) % colours.length;
      const c = colours[cycleRef.current];
      setHex(c.hex);
      setName(c.name);
    }, 1400);
    return () => clearInterval(id);
  }, []);

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
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => nav(-1)} className="h-10 w-10 grid place-items-center rounded-full bg-surface"><ArrowLeft size={18} /></button>
        <h1 className="font-display text-2xl font-bold">Scan</h1>
      </header>

      <div className="px-5">
        <div className="grid grid-cols-2 p-1 bg-surface rounded-full">
          {(["identify", "diagnose"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 text-sm font-semibold rounded-full transition-all ${tab === t ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"}`}
            >
              {t === "identify" ? "Identify Colour" : "Diagnose Mix"}
            </button>
          ))}
        </div>
      </div>

      {tab === "identify" && (
        <div className="px-5 mt-5 space-y-5">
          {/* Viewfinder */}
          <div className="relative w-full h-[280px] rounded-3xl overflow-hidden shadow-card">
            <div
              className="absolute inset-0 transition-colors duration-500"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${hex}, #1a1a1a 80%)`,
              }}
            />
            <button
              onClick={() => setTorch(t => !t)}
              className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-black/40 text-white backdrop-blur"
            >
              {torch ? <Zap size={16} /> : <ZapOff size={16} />}
            </button>
            {/* Reticle */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="relative">
                <div className="h-1 w-16 bg-white/60 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90" />
                <div className="h-1 w-16 bg-white/60 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="h-24 w-24 rounded-full border-4 border-white/90 shadow-pop grid place-items-center">
                  <div className="h-16 w-16 rounded-full transition-colors duration-500 border-2 border-white/80" style={{ background: hex }} />
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <div>
                <div className="text-xs opacity-80">Detected</div>
                <div className="font-semibold">{name}</div>
              </div>
              <div className="font-mono text-sm bg-black/40 px-2 py-1 rounded">{hex}</div>
            </div>
          </div>

          <button className="btn-primary w-full" onClick={handleScan}><Sparkles size={18} /> Scan this colour</button>

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
            <div className="surface-card p-5 animate-scale-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-20 w-20 rounded-2xl shadow-soft" style={{ background: scanned.hex }} />
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
                <button onClick={() => nav(`/guide/${scanned.id}`)} className="btn-primary">Mix guide →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "diagnose" && (
        <div className="px-5 mt-8 text-center">
          <div className="surface-card p-8">
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
