import { NavLink } from "react-router-dom";
import { Home, Camera, Palette, BookOpen, LayoutDashboard } from "lucide-react";

const items = [
  { to: "/home", label: "Home", Icon: Home },
  { to: "/scan", label: "Scan", Icon: Camera },
  { to: "/picker", label: "Mix", Icon: Palette },
  { to: "/library", label: "Library", Icon: BookOpen },
  { to: "/studio", label: "Studio", Icon: LayoutDashboard },
];

export const BottomNav = () => (
  <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur safe-bottom no-print">
    <div className="grid grid-cols-5 mx-auto max-w-md">
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-200 ease-out ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1.5 rounded-xl transition-all duration-200 ease-out ${isActive ? "bg-primary/10" : ""}`}>
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </div>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
