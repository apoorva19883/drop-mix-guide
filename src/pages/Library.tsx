import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { Camera, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deleteMix, getMixes, SavedMix } from "@/lib/storage";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

const types = ["All", "Acrylic", "Oil", "Watercolour", "Gouache"] as const;
const sorts = ["Recent", "Name", "Colour"] as const;

const Library = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [mixes, setMixes] = useState<SavedMix[]>([]);
  const [type, setType] = useState<typeof types[number]>("All");
  const [sort, setSort] = useState<typeof sorts[number]>("Recent");
  const [q, setQ] = useState("");
  const refresh = () => setMixes(getMixes());
  useEffect(refresh, []);
  useEffect(() => { const c = params.get("cat"); if (c) setQ(""); }, [params]);

  const filtered = useMemo(() => {
    let list = [...mixes];
    if (type !== "All") list = list.filter(m => m.paintType === type);
    if (q.trim()) list = list.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "Name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Colour") list.sort((a, b) => a.hex.localeCompare(b.hex));
    return list;
  }, [mixes, type, q, sort]);

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

      <div className="px-5">
        <div className="flex items-baseline gap-2 mb-4">
          <h1 className="font-display text-3xl font-bold">My Mixes</h1>
          <span className="text-muted-foreground">{mixes.length}</span>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search your mixes..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`pill shrink-0 transition-colors ${type === t ? "bg-foreground text-background" : "bg-card border border-border"}`}
            >{t}</button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4 text-xs">
          <span className="text-muted-foreground">{filtered.length} {filtered.length === 1 ? "mix" : "mixes"}</span>
          <div className="flex gap-1">
            {sorts.map(s => (
              <button key={s} onClick={() => setSort(s)} className={`px-2.5 py-1 rounded-full ${sort === s ? "bg-surface font-semibold" : "text-muted-foreground"}`}>{s}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 surface-card">
            <div className="text-5xl mb-3">🖌️</div>
            <h3 className="font-display text-xl font-bold mb-2">
              {q ? `No mixes matching "${q}"` : "No mixes saved yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">{q ? "Try a different name." : "Scan a colour to start."}</p>
            <button onClick={() => nav("/scan")} className="btn-primary"><Camera size={16} /> Scan a colour</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-8">
            {filtered.map(m => (
              <div key={m.id} className="surface-card overflow-hidden group relative animate-fade-up">
                <button onClick={() => nav(`/recipe/saved-${m.id}`)} className="block w-full text-left">
                  <div className="aspect-square w-full" style={{ background: m.hex }} />
                  <div className="p-3">
                    <div className="font-semibold text-sm truncate">{m.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="pill bg-surface text-[10px]">{m.paintType}</span>
                      <span className="text-[10px] text-muted-foreground">{m.recipe.total} drops</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">{new Date(m.savedAt).toLocaleDateString()}</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(m.id, m.name)}
                  className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-black/40 text-white backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity"
                ><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileShell>
  );
};

export default Library;
