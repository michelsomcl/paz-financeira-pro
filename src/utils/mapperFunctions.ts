
import { Cliente, Investimento, InvestimentoComCalculo } from "@/types";
import { Tables } from "@/integrations/supabase/types";
import { calcularRentabilidade } from "@/utils/calculadora";
import { parseDateString } from "@/utils/formatters";

// Helper for mapping database fields to app fields
export const mapDbClienteToCliente = (dbCliente: Tables<'clientes'>): Cliente => ({
  id: dbCliente.id,
  nome: dbCliente.nome,
  planoContratado: dbCliente.planocontratado,
  vigenciaPlano: dbCliente.vigenciaplano,
  inicioPlano: dbCliente.inicioplano || undefined,
  vencimento: dbCliente.vencimento || undefined,
  contribuicao: Number(dbCliente.contribuicao)
});

export const mapDbInvestimentoToInvestimento = (dbInv: Tables<'investimentos'>): Investimento => ({
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

export const mapClienteToDbCliente = (cliente: Cliente) => ({
  id: cliente.id,
  nome: cliente.nome,
  planocontratado: cliente.planoContratado,
  vigenciaplano: cliente.vigenciaPlano,
  inicioplano: cliente.inicioPlano || null,
  vencimento: cliente.vencimento || null,
  contribuicao: cliente.contribuicao
});

export const mapInvestimentoToDbInvestimento = (inv: Investimento) => ({
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

export function safeCalculoRentabilidade(inv: Investimento) {
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
