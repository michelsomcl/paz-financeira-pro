import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { calcularRentabilidade } from "@/utils/calculadora";
import { toast } from "@/hooks/use-toast";
import { Cliente, Investimento, InvestimentoComCalculo } from "@/types";
import { AppContext, AppContextType } from "./AppContext";
import { 
  carregarDadosLocalStorage,
  salvarCliente,
  salvarInvestimento
} from "./AppDataManager";
import { parseDateString, validateInvestmentData } from "@/utils/formatters";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AppProvider inicializado');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [investimentos, setInvestimentos] = useState<InvestimentoComCalculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados na inicialização
  useEffect(() => {
    setIsLoading(true);
    try {
      const { clientes, investimentos } = carregarDadosLocalStorage();
      setClientes(clientes);
      setInvestimentos(investimentos);
      console.log("Dados carregados do localStorage:", { clientes, investimentos });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados salvos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Adiciona um event listener para atualizar os dados
  useEffect(() => {
    const handleRefreshData = () => {
      try {
        const { clientes, investimentos } = carregarDadosLocalStorage();
        setClientes(clientes);
        setInvestimentos(investimentos);
        console.log("Dados atualizados do localStorage");
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
      }
    };

    window.addEventListener("refresh-data", handleRefreshData);
    return () => {
      window.removeEventListener("refresh-data", handleRefreshData);
    };
  }, []);

  const getClienteById = (id: string): Cliente | undefined => 
    clientes.find((c) => c.id === id);

  const adicionarCliente = async (cliente: Omit<Cliente, "id">) => {
    try {
      const novoCliente: Cliente = { ...cliente, id: uuidv4() };
      const novosClientes = [...clientes, novoCliente];
      setClientes(novosClientes);
      
      await salvarCliente(null, novosClientes, novoCliente);
      
      toast({
        title: "Cliente cadastrado",
        description: `Cliente ${novoCliente.nome} foi adicionado com sucesso.`
      });
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro ao cadastrar o cliente. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const adicionarInvestimento = async (investimento: Omit<Investimento, 'id' | 'clienteNome' | 'planoContratado'>) => {
    try {
      const cliente = getClienteById(investimento.clienteId);
      if (!cliente) {
        toast({
          title: "Erro ao cadastrar investimento",
          description: "Cliente não encontrado.",
          variant: "destructive"
        });
        return;
      }
      
      const validationError = validateInvestmentData(
        investimento.valorAporte,
        investimento.dataAporte,
        investimento.dataVencimento
      );
      
      if (validationError) {
        toast({
          title: "Dados inválidos",
          description: validationError,
          variant: "destructive"
        });
        return;
      }
      
      const novoInvestimento: Investimento = {
        ...investimento,
        id: uuidv4(),
        clienteNome: cliente.nome,
        planoContratado: cliente.planoContratado
      };
      
      try {
        const calculo = calcularRentabilidade(novoInvestimento);
        const novoInvestimentoComCalculo = { ...novoInvestimento, calculo };
        const novosInvestimentos = [...investimentos, novoInvestimentoComCalculo];
        
        setInvestimentos(novosInvestimentos);
        await salvarInvestimento(null, novosInvestimentos, novoInvestimento);
        
        toast({
          title: "Investimento cadastrado",
          description: `Investimento para ${cliente.nome} foi adicionado com sucesso.`
        });
      } catch (error) {
        console.error("Erro ao calcular rentabilidade:", error);
        toast({
          title: "Erro no cálculo",
          description: "Não foi possível calcular a rentabilidade. Verifique os dados.",
          variant: "destructive"
        });
        throw error;
      }
    } catch (error) {
      console.error("Erro ao adicionar investimento:", error);
      toast({
        title: "Erro ao cadastrar investimento",
        description: "Ocorreu um erro ao cadastrar o investimento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const excluirInvestimento = async (id: string) => {
    try {
      const novosInvestimentos = investimentos.filter(inv => inv.id !== id);
      setInvestimentos(novosInvestimentos);
      
      const investimentosSemCalculo = novosInvestimentos.map(({ calculo, ...rest }) => rest);
      localStorage.setItem('paz-financeira-investimentos', JSON.stringify(investimentosSemCalculo));
      
      toast({
        title: "Investimento excluído",
        description: "O investimento foi removido com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir investimento:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o investimento.",
        variant: "destructive"
      });
    }
  };

  const excluirCliente = async (id: string) => {
    try {
      const temInvestimentos = investimentos.some(inv => inv.clienteId === id);
      if (temInvestimentos) {
        toast({
          title: "Não foi possível excluir",
          description: "Este cliente possui investimentos cadastrados. Exclua os investimentos primeiro.",
          variant: "destructive"
        });
        return;
      }
      
      const novosClientes = clientes.filter(cliente => cliente.id !== id);
      setClientes(novosClientes);
      
      localStorage.setItem('paz-financeira-clientes', JSON.stringify(novosClientes));
      
      toast({
        title: "Cliente excluído",
        description: "O cliente foi removido com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o cliente.",
        variant: "destructive"
      });
    }
  };

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
