
import * as XLSX from 'xlsx';
import { InvestimentoComCalculo } from '@/types';
import { formatarDescricaoTaxa } from '@/utils/calculadora';
import { toast } from '@/hooks/use-toast';

export const exportarInvestimentosParaExcel = (investimentos: InvestimentoComCalculo[]) => {
  const dados = investimentos.map(inv => ({
    'ID do Cliente': inv.clienteId,
    'Cliente': inv.clienteNome,
    'Tipo': inv.tipoInvestimento,
    'Modalidade': inv.modalidade,
    'Título': inv.titulo || '', // Add the Título column
    'Valor do Aporte': inv.valorAporte,
    'Data do Aporte': inv.dataAporte,
    'Data do Vencimento': inv.dataVencimento,
    'Taxa Utilizada': formatarDescricaoTaxa(inv),
    'Dias Corridos': inv.calculo.diasCorridos,
    'Dias Úteis': inv.calculo.diasUteis,
    'Rendimento Bruto': inv.calculo.rendimentoBruto,
    'IR': inv.calculo.valorIR,
    'IOF': inv.calculo.valorIOF,
    'Rendimento Líquido': inv.calculo.rendimentoLiquido
  }));
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dados);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Investimentos');
  XLSX.writeFile(workbook, 'investimentos.xlsx');
};

export const baixarTemplateExcel = () => {
  const colunas = [
    'Cliente ID',
    'Tipo Investimento',
    'Modalidade',
    'Título',
    'Valor do Aporte',
    'Data do Aporte',
    'Data do Vencimento',
    'IPCA Atual',
    'Selic Atual',
    'Taxa Pré Fixado',
    'Taxa Pós CDI',
    'Taxa IPCA'
  ];

  const exemplo = {
    'Cliente ID': 'ID do cliente cadastrado no sistema',
    'Tipo Investimento': 'CDB, LCI, LCA ou LCD',
    'Modalidade': 'Pré Fixado, Pós Fixado ou IPCA+',
    'Título': 'Nome do título (opcional)',
    'Valor do Aporte': '1000',
    'Data do Aporte': '01/01/2025',
    'Data do Vencimento': '01/07/2025',
    'IPCA Atual': '4.5',
    'Selic Atual': '10.5',
    'Taxa Pré Fixado': '12.5',
    'Taxa Pós CDI': '105',
    'Taxa IPCA': '6.0'
  };

  const dadosExemplo = [exemplo];
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dadosExemplo);
  
  XLSX.utils.sheet_add_aoa(worksheet, [
    ['INSTRUÇÕES PARA PREENCHIMENTO'],
    ['1. Cliente ID deve ser um ID válido de cliente cadastrado no sistema'],
    ['2. Tipo Investimento deve ser um dos seguintes valores: CDB, LCI, LCA, LCD'],
    ['3. Modalidade deve ser um dos seguintes valores: Pré Fixado, Pós Fixado, IPCA+'],
    ['4. Datas devem ser no formato DD/MM/AAAA'],
    ['5. Valores decimais devem usar ponto (.) como separador'],
    ['6. Preencha apenas a taxa correspondente à modalidade selecionada']
  ], { origin: 'A20' });
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  XLSX.writeFile(workbook, 'template_importacao.xlsx');

  toast({
    title: "Template Baixado",
    description: "O template de importação foi baixado com sucesso.",
  });
};

