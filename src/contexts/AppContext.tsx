import React, { createContext, useContext } from "react";
import { Cliente, InvestimentoComCalculo } from "@/types";

export interface AppContextType {
  clientes: Cliente[];
  investimentos: InvestimentoComCalculo[];
  adicionarCliente: (cliente: Omit<Cliente, 'id'>) => void;
  adicionarInvestimento: (investimento: Omit<any, 'id' | 'clienteNome' | 'planoContratado'>) => void;
  excluirInvestimento: (id: string) => void;
  excluirCliente: (id: string) => void;
  getClienteById: (id: string) => Cliente | undefined;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};
