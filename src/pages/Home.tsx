import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { MobileShell } from "@/components/MobileShell";
import { Camera, Search, Sparkles } from "lucide-react";
import { colours } from "@/data/colours";
import { getMixes, getPrefs } from "@/lib/storage";
import { useEffect, useState } from "react";
import { ProportionBar } from "@/components/ProportionBar";

const categories = [
  { label: "Warm tones", filter: "Warm", color: "#E8572A" },
  { label: "Cool tones", filter: "Cool", color: "#5B7FBF" },
  { label: "Neutrals", filter: "Neutral", color: "#9E9485" },
  { label: "Earth tones", filter: "Warm", color: "#8B4513" },
];

const Home = () => {
  const nav = useNavigate();
  const [mixes, setMixes] = useState(getMixes());
  const [prefs, setP] = useState(getPrefs());
  useEffect(() => { setMixes(getMixes()); setP(getPrefs()); }, []);

  const featured = colours[new Date().getDate() % colours.length];
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <Logo />
        <button onClick={() => nav("/library")} className="h-10 w-10 rounded-full bg-surface grid place-items-center hover:bg-border transition-colors duration-200 ease-out">
          <Search size={18} />
        </button>
      </header>

      <section className="px-5 pt-4">
        <h1 className="font-display text-3xl font-bold leading-tight">{greeting}, {prefs.name} 👋</h1>
        <p className="text-muted-foreground mt-1">What are you mixing today?</p>
      </section>

      <section className="px-5 mt-6 space-y-3">
        <button onClick={() => nav("/scan")} className="btn-primary w-full text-base py-4">
          <Camera size={20} /> Scan a colour
        </button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>
        <button onClick={() => nav("/picker")} className="btn-ghost w-full">Pick from colour wheel</button>
      </section>

      {mixes.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="font-display text-lg font-bold">Recent mixes</h2>
            <button onClick={() => nav("/library")} className="text-xs text-primary font-medium">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
            {mixes.slice(0, 8).map(m => (
              <button key={m.id} onClick={() => nav(`/recipe/saved-${m.id}`)} className="shrink-0 w-20 text-left">
                <div className="h-20 w-20 rounded-2xl shadow-card border border-border" style={{ background: m.hex }} />
                <div className="text-xs font-medium mt-2 truncate">{m.name}</div>
                <div className="text-[10px] text-muted-foreground">{m.recipe.total} drops</div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 px-5">
        <h2 className="font-display text-lg font-bold mb-3">Quick categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c.label}
              onClick={() => nav(`/library?cat=${c.filter}`)}
              className="pill bg-card border border-border hover:border-primary/40 transition-colors duration-200 ease-out"
            >
              <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-primary" />
          <h2 className="font-display text-lg font-bold">Featured mix of the day</h2>
        </div>
        <button onClick={() => nav(`/colour/${featured.id}`)} className="surface-card w-full p-5 text-left hover:shadow-pop transition-shadow duration-200 ease-out">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-2xl shadow-soft" style={{ background: featured.hex }} />
            <div className="flex-1 min-w-0">
              <div className="font-display text-xl font-bold truncate">{featured.name}</div>
              <div className="text-xs text-muted-foreground">{featured.hex} · {featured.category}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {featured.mood.slice(0, 2).map(m => <span key={m} className="pill bg-surface text-[10px]">{m}</span>)}
              </div>
            </div>
          </div>
          <ProportionBar recipe={featured.recipe} height={36} animate={false} />
        </button>
      </section>
    </MobileShell>
  );
};

export default Home;
