import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isOnboarded } from "@/lib/storage";

const Index = () => {
  const nav = useNavigate();
  useEffect(() => {
    nav(isOnboarded() ? "/home" : "/onboarding", { replace: true });
  }, [nav]);
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="animate-pulse text-muted-foreground text-sm">Loading MixRight…</div>
    </div>
  );
};

export default Index;
