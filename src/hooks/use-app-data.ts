
import { useState, useCallback } from "react";
import { Cliente, InvestimentoComCalculo } from "@/types";
import { carregarDadosSupabase, carregarDadosLocalStorage } from "@/services/dataLoaders";
import { toast } from "@/hooks/use-toast";

export function useAppData() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [investimentos, setInvestimentos] = useState<InvestimentoComCalculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    try {
      // Tentar carregar do Supabase primeiro
      const { clientes, investimentos } = await carregarDadosSupabase();
      setClientes(clientes);
      setInvestimentos(investimentos);
      console.log("Dados carregados do Supabase:", { clientes, investimentos });
    } catch (error) {
      console.error('Erro ao carregar dados do Supabase:', error);
      // Fallback para localStorage
      const localData = carregarDadosLocalStorage();
      setClientes(localData.clientes);
      setInvestimentos(localData.investimentos);
      console.log("Dados carregados do localStorage (fallback):", localData);
      
      toast({
        title: "Erro ao carregar dados do Supabase",
        description: "Dados foram carregados do armazenamento local como fallback.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { clientes, setClientes, investimentos, setInvestimentos, isLoading, carregarDados };
}
