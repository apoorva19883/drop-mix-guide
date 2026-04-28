import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import Picker from "./pages/Picker";
import Recipe from "./pages/Recipe";
import Guide from "./pages/Guide";
import Library from "./pages/Library";
import ColourDetail from "./pages/ColourDetail";
import Studio from "./pages/Studio";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/picker" element={<Picker />} />
          <Route path="/recipe/:id" element={<Recipe />} />
          <Route path="/guide/:id" element={<Guide />} />
          <Route path="/library" element={<Library />} />
          <Route path="/colour/:id" element={<ColourDetail />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
