import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export const MobileShell = ({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) => (
  <div className="min-h-screen bg-background pb-24 lg:pb-0">
    <div className="mx-auto w-full max-w-md lg:max-w-2xl">{children}</div>
    {!hideNav && <BottomNav />}
  </div>
);
