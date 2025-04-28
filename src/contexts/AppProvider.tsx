
import React from "react";
import { AppContext, AppContextType } from "./AppContext";
import { useAppData } from "@/hooks/use-app-data";
import { useClienteOperations } from "@/hooks/use-cliente-operations";
import { useInvestimentoOperations } from "@/hooks/use-investimento-operations";
import { useRefreshListener } from "@/hooks/use-refresh-listener";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AppProvider inicializado');
  
  // Load app data
  const { 
    clientes, 
    setClientes, 
    investimentos, 
    setInvestimentos, 
    isLoading, 
    carregarDados 
  } = useAppData();
  
  // Load on initialization
  React.useEffect(() => {
    carregarDados();
  }, [carregarDados]);
  
  // Setup cliente operations
  const { getClienteById, adicionarCliente, excluirCliente } = useClienteOperations(
    clientes, 
    setClientes, 
    investimentos
  );
  
  // Setup investimento operations
  const { adicionarInvestimento, excluirInvestimento } = useInvestimentoOperations(
    investimentos, 
    setInvestimentos, 
    getClienteById
  );
  
  // Setup refresh listener
  useRefreshListener(carregarDados);
  
  // Setup Supabase realtime
  useSupabaseRealtime(carregarDados);

  const value: AppContextType = {
    clientes,
    investimentos,
    adicionarCliente,
    adicionarInvestimento,
    excluirInvestimento,
    excluirCliente,
    getClienteById,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
