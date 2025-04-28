
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { calcularRentabilidade } from "@/utils/calculadora";
import { toast } from "@/hooks/use-toast";
import { Cliente, Investimento, InvestimentoComCalculo } from "@/types";
import { AppContext, AppContextType } from "./AppContext";
import { 
  carregarDadosSupabase,
  carregarDadosLocalStorage,
  salvarCliente,
  salvarInvestimento
} from "./AppDataManager";
import { parseDateString, validateInvestmentData } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AppProvider inicializado');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [investimentos, setInvestimentos] = useState<InvestimentoComCalculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados na inicialização
  useEffect(() => {
    const carregarDados = async () => {
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
    };
    
    carregarDados();
  }, []);

  // Adiciona um event listener para atualizar os dados
  useEffect(() => {
    const handleRefreshData = async () => {
      try {
        const { clientes, investimentos } = await carregarDadosSupabase();
        setClientes(clientes);
        setInvestimentos(investimentos);
        console.log("Dados atualizados do Supabase");
      } catch (error) {
        console.error("Erro ao atualizar dados do Supabase:", error);
      }
    };

    window.addEventListener("refresh-data", handleRefreshData);
    return () => {
      window.removeEventListener("refresh-data", handleRefreshData);
    };
  }, []);

  // Configura um listener para atualizações em tempo real do Supabase (opcional)
  useEffect(() => {
    const clientesSubscription = supabase
      .channel('clientes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, handleRefreshData)
      .subscribe();
      
    const investimentosSubscription = supabase
      .channel('investimentos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investimentos' }, handleRefreshData)
      .subscribe();
      
    async function handleRefreshData() {
      try {
        const { clientes, investimentos } = await carregarDadosSupabase();
        setClientes(clientes);
        setInvestimentos(investimentos);
        console.log("Dados atualizados automaticamente via Supabase Realtime");
      } catch (error) {
        console.error("Erro ao atualizar dados via Supabase Realtime:", error);
      }
    }

    return () => {
      supabase.removeChannel(clientesSubscription);
      supabase.removeChannel(investimentosSubscription);
    };
  }, []);

  const getClienteById = (id: string): Cliente | undefined => 
    clientes.find((c) => c.id === id);

  const adicionarCliente = async (cliente: Omit<Cliente, "id">) => {
    try {
      const novoCliente: Cliente = { ...cliente, id: uuidv4() };
      const novosClientes = [...clientes, novoCliente];
      setClientes(novosClientes);
      
      await salvarCliente(supabase, novosClientes, novoCliente);
      
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
        await salvarInvestimento(supabase, novosInvestimentos, novoInvestimento);
        
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
      // Excluir do Supabase
      const { error } = await supabase
        .from('investimentos')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Erro ao excluir investimento do Supabase:", error);
        throw error;
      }
      
      const novosInvestimentos = investimentos.filter(inv => inv.id !== id);
      setInvestimentos(novosInvestimentos);
      
      // Atualizar o backup no localStorage
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
      
      // Excluir do Supabase
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Erro ao excluir cliente do Supabase:", error);
        throw error;
      }
      
      const novosClientes = clientes.filter(cliente => cliente.id !== id);
      setClientes(novosClientes);
      
      // Atualizar o backup no localStorage
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
