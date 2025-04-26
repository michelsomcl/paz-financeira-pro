
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { AppProvider } from "@/contexts/AppProvider";
import Index from "./pages/Index";
import ClientesPage from "./pages/ClientesPage";
import InvestimentosPage from "./pages/InvestimentosPage";
import InvestimentosListPage from "./pages/InvestimentosListPage";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/investimentos/novo" element={<InvestimentosPage />} />
                <Route path="/investimentos" element={<InvestimentosListPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
