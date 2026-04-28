import { Recipe } from "@/data/colours";
import { DropIcon } from "./DropIcon";

export const IngredientList = ({ recipe, scale = 1, brand }: { recipe: Recipe; scale?: number; brand?: string }) => (
  <div className="space-y-2">
    {recipe.ingredients.map((ing, i) => {
      const drops = ing.drops * scale;
      return (
        <div key={i} className="flex items-center gap-3 rounded-xl bg-surface p-3 border border-border/60">
          <div
            className="h-10 w-10 shrink-0 rounded-lg border border-border shadow-soft"
            style={{ background: ing.hex }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{ing.paint}</div>
            {brand && <div className="text-xs text-muted-foreground truncate">{brand} · Artist series</div>}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(drops, 6) }).map((_, k) => (
                <DropIcon key={k} size={11} color={ing.hex} className="opacity-90" />
              ))}
              {drops > 6 && <span className="text-xs font-medium ml-1">+{drops - 6}</span>}
            </div>
            <span className="ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-foreground px-2 text-xs font-bold text-background tabular-nums">
              {drops}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);
