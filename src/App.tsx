
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClientPickup from "./pages/ClientPickup";
import ScheduleCollection from "./pages/ScheduleCollection";
import RequestQuote from "./pages/RequestQuote";
import NotasControl from "./pages/NotasControl";
import NotasDashboard from "./pages/NotasDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/client-pickup" element={<ClientPickup />} />
          <Route path="/schedule-collection" element={<ScheduleCollection />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/notas-control" element={<NotasControl />} />
          <Route path="/notas-dashboard" element={<NotasDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
