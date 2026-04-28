import { DropIcon } from "./DropIcon";
import { Link } from "react-router-dom";

export const Logo = ({ to = "/home", showDot = true }: { to?: string; showDot?: boolean }) => (
  <Link to={to} className="inline-flex items-center gap-2 group">
    <div className="relative inline-flex">
      <DropIcon size={22} color="hsl(var(--primary))" className="transition-transform group-hover:rotate-12" />
    </div>
    <span className="font-display text-lg font-bold tracking-tight">
      MixRight{showDot && <span className="text-primary">.</span>}
    </span>
  </Link>
);
