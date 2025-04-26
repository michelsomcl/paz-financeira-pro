
import { calcularRentabilidade } from "@/utils/calculadora";
import { toast } from "@/hooks/use-toast";
import { Cliente, Investimento, InvestimentoComCalculo } from "@/types";
import { parseDateString } from "@/utils/formatters";

export const carregarDadosSupabase = async () => {
  // Agora carrega apenas do localStorage
  return carregarDadosLocalStorage();
};

export const carregarDadosLocalStorage = () => {
  let clientes: Cliente[] = [];
  let investimentos: InvestimentoComCalculo[] = [];
  try {
    const storedClientes = localStorage.getItem("paz-financeira-clientes");
    const storedInvestimentos = localStorage.getItem("paz-financeira-investimentos");
    if (storedClientes) {
      clientes = JSON.parse(storedClientes);
    }
    if (storedInvestimentos) {
      const parsedInvestimentos: Investimento[] = JSON.parse(storedInvestimentos);
      investimentos = parsedInvestimentos.map(inv => ({
        ...inv,
        calculo: safeCalculoRentabilidade(inv)
      }));
    }
  } catch (e) {
    console.error("Erro ao carregar dados do localStorage:", e);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar os dados salvos.",
      variant: "destructive"
    });
    clientes = [];
    investimentos = [];
  }
  return { clientes, investimentos };
};

export const salvarCliente = async (_supabase: any, clientes: Cliente[], cliente: Cliente) => {
  try {
    localStorage.setItem("paz-financeira-clientes", JSON.stringify(clientes));
    console.log("Cliente salvo no localStorage:", cliente);
    
    toast({
      title: "Cliente salvo",
      description: "O cliente foi salvo com sucesso."
    });
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    toast({
      title: "Erro ao salvar",
      description: "Não foi possível salvar o cliente.",
      variant: "destructive"
    });
    throw error;
  }
};

export const salvarInvestimento = async (_supabase: any, investimentos: InvestimentoComCalculo[], investimento: Investimento) => {
  try {
    const investimentosSemCalculo = investimentos.map(({ calculo, ...rest }) => rest);
    localStorage.setItem("paz-financeira-investimentos", JSON.stringify(investimentosSemCalculo));
    console.log("Investimento salvo no localStorage:", investimento);
    
    toast({
      title: "Investimento salvo",
      description: "O investimento foi salvo com sucesso."
    });
  } catch (error) {
    console.error("Erro ao salvar investimento:", error);
    toast({
      title: "Erro ao salvar",
      description: "Não foi possível salvar o investimento.",
      variant: "destructive"
    });
    throw error;
  }
};

function safeCalculoRentabilidade(inv: Investimento) {
  try {
    // Verify data integrity before calculation
    const dataAporte = parseDateString(inv.dataAporte);
    const dataVencimento = parseDateString(inv.dataVencimento);
    
    if (!dataAporte || !dataVencimento) {
      throw new Error("Datas inválidas");
    }
    
    // Check if we have the appropriate tax for the modality
    switch (inv.modalidade) {
      case 'Pré Fixado':
        if (inv.taxaPreFixado === undefined) {
          throw new Error("Taxa pré-fixada não informada");
        }
        break;
      case 'Pós Fixado':
        if (inv.taxaPosCDI === undefined) {
          throw new Error("Taxa pós-CDI não informada");
        }
        break;
      case 'IPCA+':
        if (inv.taxaIPCA === undefined) {
          throw new Error("Taxa IPCA+ não informada");
        }
        break;
    }
    
    return calcularRentabilidade(inv);
  } catch (e) {
    console.error("Erro ao calcular rentabilidade:", e, inv);
    return {
      diasCorridos: 0,
      diasUteis: 0,
      taxaEfetiva: 0,
      montanteValorBruto: 0,
      rendimentoBruto: 0,
      aliquotaIR: 0,
      valorIR: 0,
      valorIOF: 0,
      rendimentoLiquido: 0
    };
  }
}
