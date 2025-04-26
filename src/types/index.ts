export interface Cliente {
  id: string;
  nome: string;
  planoContratado: string;
  vigenciaPlano: string;
  inicioPlano?: string;
  contribuicao: number;
}

export type TipoInvestimento = 'CDB' | 'LCI' | 'LCA' | 'LCD';

export type Modalidade = 'Pré Fixado' | 'Pós Fixado' | 'IPCA+';

export interface Investimento {
  id: string;
  clienteId: string;
  clienteNome: string;
  tipoInvestimento: TipoInvestimento;
  modalidade: Modalidade;
  titulo?: string;
  valorAporte: number;
  dataAporte: string;
  dataVencimento: string;
  ipcaAtual: number;
  selicAtual: number;
  taxaPreFixado?: number;
  taxaPosCDI?: number;
  taxaIPCA?: number;
  planoContratado: string;
}

export interface CalculoRentabilidade {
  diasCorridos: number;
  diasUteis: number;
  taxaEfetiva: number;
  montanteValorBruto: number;
  rendimentoBruto: number;
  aliquotaIR: number;
  valorIR: number;
  valorIOF: number;
  rendimentoLiquido: number;
}

export interface InvestimentoComCalculo extends Investimento {
  calculo: CalculoRentabilidade;
}

export interface TabelaIOF {
  [key: number]: number;
}
