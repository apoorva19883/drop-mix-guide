import { Recipe, textOn } from "@/data/colours";
import { DropIcon } from "./DropIcon";
import { useEffect, useState } from "react";

interface Props {
  recipe: Recipe;
  scale?: number;
  height?: number;
  showLabels?: boolean;
  animate?: boolean;
}

export const ProportionBar = ({ recipe, scale = 1, height = 52, showLabels = false, animate = true }: Props) => {
  const total = recipe.total * scale;
  const [mounted, setMounted] = useState(!animate);
  useEffect(() => { if (animate) requestAnimationFrame(() => setMounted(true)); }, [animate]);

  return (
    <div>
      <div
        className="flex w-full overflow-hidden rounded-2xl border border-border shadow-soft"
        style={{ height }}
      >
        {recipe.ingredients.map((ing, i) => {
          const pct = (ing.drops / recipe.total) * 100;
          const dropCount = ing.drops * scale;
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-center transition-all duration-300 ease-out overflow-hidden relative"
              style={{
                width: mounted ? `${pct}%` : "0%",
                background: ing.hex,
                color: "#FFFFFF",
                borderLeft: i === 0 ? undefined : "2px solid #FFFFFF",
              }}
              title={`${ing.paint} · ${dropCount} drops`}
            >
              {pct >= 10 && (
                <div className="flex items-center gap-1 px-1" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>
                  <DropIcon size={Math.min(14, height / 4)} color="#FFFFFF" />
                  <span className="text-xs font-bold tabular-nums text-white">{dropCount}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div className="mt-2 flex w-full text-[10px] text-muted-foreground">
          {recipe.ingredients.map((ing, i) => (
            <div
              key={i}
              className="truncate text-center px-1"
              style={{ width: `${(ing.drops / recipe.total) * 100}%` }}
            >
              {ing.paint.split(" ")[0]}
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{recipe.ingredients.length} paints</span>
        <span className="font-semibold text-foreground">{total} drops total</span>
      </div>
    </div>
  );
};
