
import { calcularRentabilidade } from "@/utils/calculadora";
import { toast } from "@/hooks/use-toast";
import { Cliente, Investimento, InvestimentoComCalculo } from "@/types";
import { parseDateString } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Helper for mapping database fields to app fields
const mapDbClienteToCliente = (dbCliente: Tables<'clientes'>): Cliente => ({
  id: dbCliente.id,
  nome: dbCliente.nome,
  planoContratado: dbCliente.planocontratado,
  vigenciaPlano: dbCliente.vigenciaplano,
  inicioPlano: dbCliente.inicioplano || undefined,
  vencimento: dbCliente.vencimento || undefined,
  contribuicao: Number(dbCliente.contribuicao)
});

const mapDbInvestimentoToInvestimento = (dbInv: Tables<'investimentos'>): Investimento => ({
  id: dbInv.id,
  clienteId: dbInv.clienteid,
  clienteNome: dbInv.clientenome,
  tipoInvestimento: dbInv.tipoinvestimento as any,
  modalidade: dbInv.modalidade as any,
  titulo: dbInv.titulo || undefined,
  valorAporte: Number(dbInv.valoraporte),
  dataAporte: dbInv.dataaporte,
  dataVencimento: dbInv.datavencimento,
  ipcaAtual: Number(dbInv.ipcaatual),
  selicAtual: Number(dbInv.selicatual),
  taxaPreFixado: dbInv.taxaprefixado ? Number(dbInv.taxaprefixado) : undefined,
  taxaPosCDI: dbInv.taxaposcdi ? Number(dbInv.taxaposcdi) : undefined,
  taxaIPCA: dbInv.taxaipca ? Number(dbInv.taxaipca) : undefined,
  planoContratado: dbInv.planocontratado
});

const mapClienteToDbCliente = (cliente: Cliente) => ({
  id: cliente.id,
  nome: cliente.nome,
  planocontratado: cliente.planoContratado,
  vigenciaplano: cliente.vigenciaPlano,
  inicioplano: cliente.inicioPlano || null,
  vencimento: cliente.vencimento || null,
  contribuicao: cliente.contribuicao
});

const mapInvestimentoToDbInvestimento = (inv: Investimento) => ({
  id: inv.id,
  clienteid: inv.clienteId,
  clientenome: inv.clienteNome,
  tipoinvestimento: inv.tipoInvestimento,
  modalidade: inv.modalidade,
  titulo: inv.titulo || null,
  valoraporte: inv.valorAporte,
  dataaporte: inv.dataAporte,
  datavencimento: inv.dataVencimento,
  ipcaatual: inv.ipcaAtual,
  selicatual: inv.selicAtual,
  taxaprefixado: inv.taxaPreFixado || null,
  taxaposcdi: inv.taxaPosCDI || null,
  taxaipca: inv.taxaIPCA || null,
  planocontratado: inv.planoContratado
});

export const carregarDadosSupabase = async () => {
  try {
    // Carregar clientes do Supabase
    const { data: clientesData, error: clientesError } = await supabase
      .from('clientes')
      .select('*');

    if (clientesError) {
      console.error("Erro ao carregar clientes do Supabase:", clientesError);
      throw clientesError;
    }

    // Carregar investimentos do Supabase
    const { data: investimentosData, error: investimentosError } = await supabase
      .from('investimentos')
      .select('*');

    if (investimentosError) {
      console.error("Erro ao carregar investimentos do Supabase:", investimentosError);
      throw investimentosError;
    }

    // Processar investimentos para adicionar cálculos
    const clientes = clientesData.map(mapDbClienteToCliente);
    const investimentos = investimentosData.map(dbInv => {
      const inv = mapDbInvestimentoToInvestimento(dbInv);
      return {
        ...inv,
        calculo: safeCalculoRentabilidade(inv)
      };
    });

    return { clientes, investimentos };
  } catch (e) {
    console.error("Erro ao carregar dados do Supabase:", e);
    // Fallback para localStorage em caso de erro
    return carregarDadosLocalStorage();
  }
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

export const salvarCliente = async (supabaseClient: typeof supabase, clientes: Cliente[], cliente: Cliente) => {
  try {
    // Convert to DB format
    const dbCliente = mapClienteToDbCliente(cliente);
    
    // Salvar no Supabase
    const { error } = await supabaseClient
      .from('clientes')
      .upsert([dbCliente], { onConflict: 'id' });
    
    if (error) {
      console.error("Erro ao salvar cliente no Supabase:", error);
      throw error;
    }
    
    // Backup no localStorage
    localStorage.setItem("paz-financeira-clientes", JSON.stringify(clientes));
    console.log("Cliente salvo no Supabase e localStorage:", cliente);
    
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

export const salvarInvestimento = async (supabaseClient: typeof supabase, investimentos: InvestimentoComCalculo[], investimento: Investimento) => {
  try {
    // Convert to DB format
    const dbInvestimento = mapInvestimentoToDbInvestimento(investimento);
    
    // Salvar no Supabase
    const { error } = await supabaseClient
      .from('investimentos')
      .upsert([dbInvestimento], { onConflict: 'id' });
    
    if (error) {
      console.error("Erro ao salvar investimento no Supabase:", error);
      throw error;
    }
    
    // Backup no localStorage
    const investimentosSemCalculo = investimentos.map(({ calculo, ...rest }) => rest);
    localStorage.setItem("paz-financeira-investimentos", JSON.stringify(investimentosSemCalculo));
    console.log("Investimento salvo no Supabase e localStorage:", investimento);
    
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
