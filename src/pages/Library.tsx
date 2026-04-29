import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { Camera, Search, Trash2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deleteMix, getMixes, SavedMix } from "@/lib/storage";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { classifyTemperature, fuzzyFilter, temperatureRank, type Temperature } from "@/lib/search";

const types = ["All", "Acrylic", "Oil", "Watercolour", "Gouache"] as const;
const temps = ["All", "Warm", "Cool", "Neutral"] as const;
const sorts = ["Recent", "Name", "Warm → Cool", "Cool → Warm"] as const;

const Library = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [mixes, setMixes] = useState<SavedMix[]>([]);
  const [type, setType] = useState<typeof types[number]>("All");
  const [temp, setTemp] = useState<typeof temps[number]>("All");
  const [sort, setSort] = useState<typeof sorts[number]>("Recent");
  const [q, setQ] = useState("");
  const refresh = () => setMixes(getMixes());
  useEffect(refresh, []);
  useEffect(() => {
    const c = params.get("cat");
    if (c === "Warm" || c === "Cool" || c === "Neutral") setTemp(c);
  }, [params]);

  const filtered = useMemo(() => {
    let list = mixes.map(m => ({ ...m, _temp: classifyTemperature(m.hex) as Temperature }));
    if (type !== "All") list = list.filter(m => m.paintType === type);
    if (temp !== "All") list = list.filter(m => m._temp === temp);
    list = fuzzyFilter(list, q, m => [m.name, m._temp, m.paintType, m.hex]);
    if (sort === "Name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Warm → Cool") list.sort((a, b) => temperatureRank(a._temp) - temperatureRank(b._temp));
    else if (sort === "Cool → Warm") list.sort((a, b) => temperatureRank(b._temp) - temperatureRank(a._temp));
    else if (!q.trim()) list.sort((a, b) => b.savedAt - a.savedAt);
    return list;
  }, [mixes, type, temp, q, sort]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      deleteMix(id); refresh(); toast.success("Mix deleted");
    }
  };

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <Logo />
      </header>

      <div className="px-5 pb-28">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-display text-[22px] font-bold">My Mixes</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {mixes.length} mixes
          </span>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search by name, hex, mood…"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Paint type filter — underlined active */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide border-b border-border mb-4">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`relative shrink-0 pb-2.5 text-sm transition-colors ${type === t ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
              {type === t && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {/* Temperature pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2">
          {temps.map(t => {
            const dot = t === "Warm" ? "#E8572A" : t === "Cool" ? "#5B7FBF" : t === "Neutral" ? "#9E9485" : null;
            return (
              <button
                key={t}
                onClick={() => setTemp(t)}
                className={`pill shrink-0 transition-all ${temp === t ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
              >
                {dot && <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />}
                {t}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-4 text-xs gap-2">
          <span className="text-muted-foreground shrink-0">{filtered.length} {filtered.length === 1 ? "mix" : "mixes"}</span>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {sorts.map(s => (
              <button key={s} onClick={() => setSort(s)} className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${sort === s ? "bg-surface font-semibold" : "text-muted-foreground"}`}>{s}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div className="text-5xl mb-3">🖌️</div>
            <h3 className="font-display text-xl font-bold mb-2">
              {q ? `No mixes matching "${q}"` : "No mixes saved yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">{q ? "Try a different name." : "Scan a colour to start."}</p>
            <button onClick={() => nav("/scan")} className="btn-primary"><Camera size={16} /> Scan a colour</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 animate-fade-up">
            {filtered.map(m => (
              <div
                key={m.id}
                className="rounded-xl overflow-hidden group relative bg-card transition-all duration-200 ease-out hover:-translate-y-0.5"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <button onClick={() => nav(`/recipe/saved-${m.id}`)} className="block w-full text-left">
                  {/* 65% solid colour fill */}
                  <div className="relative w-full" style={{ height: 0, paddingBottom: "65%", background: m.hex }}>
                    <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-gradient-to-t from-black/55 to-transparent text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
                      {m.name}
                    </div>
                  </div>
                  {/* 35% white meta */}
                  <div className="bg-card px-3 py-2.5" style={{ minHeight: "35%" }}>
                    <div className="font-semibold text-sm truncate">{m.name}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="pill bg-surface text-[10px]">{m.paintType}</span>
                      <span className="text-[10px] text-muted-foreground">{m.recipe.total} drops</span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(m.id, m.name)}
                  className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-black/40 text-white backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out"
                ><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating scan button */}
      <button
        onClick={() => nav("/scan")}
        className="fixed bottom-24 right-5 z-30 h-14 px-5 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2 shadow-pop transition-transform hover:scale-105 active:scale-95 lg:hidden"
        aria-label="Scan a new colour"
      >
        <Plus size={18} strokeWidth={2.5} /> <Camera size={16} />
      </button>
    </MobileShell>
  );
};

export default Library;
