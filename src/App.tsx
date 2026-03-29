import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ServicoDeCampo from "./pages/ServicoDeCampo.tsx";
import Designacoes from "./pages/Designacoes.tsx";
import VidaMinisterio from "./pages/VidaMinisterio.tsx";
import ReuniaoPublica from "./pages/ReuniaoPublica.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/servico-de-campo" element={<ServicoDeCampo />} />
          <Route path="/designacoes" element={<Designacoes />} />
          <Route path="/vida-ministerio" element={<VidaMinisterio />} />
          <Route path="/reuniao-publica" element={<ReuniaoPublica />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
