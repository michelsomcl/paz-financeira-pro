
import { v4 as uuidv4 } from "uuid";
import { calcularRentabilidade } from "@/utils/calculadora";
import { Investimento, InvestimentoComCalculo } from "@/types";
import { toast } from "@/hooks/use-toast";
import { salvarInvestimento } from "@/contexts/AppDataManager";
import { supabase } from "@/integrations/supabase/client";
import { validateInvestmentData } from "@/utils/formatters";

export function useInvestimentoOperations(
  investimentos: InvestimentoComCalculo[],
  setInvestimentos: React.Dispatch<React.SetStateAction<InvestimentoComCalculo[]>>,
  getClienteById: (id: string) => any
) {
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

  return { adicionarInvestimento, excluirInvestimento };
}
