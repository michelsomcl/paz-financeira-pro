
import { Cliente } from '@/types';
import { toast } from '@/hooks/use-toast';

export const processarDadosImportacao = (dados: any[], clientes: Cliente[], adicionarInvestimento: Function) => {
  let sucessos = 0;
  let falhas = 0;

  dados.forEach(item => {
    try {
      const clienteId = item['Cliente ID'];
      if (!clienteId) {
        throw new Error("ID do cliente não informado");
      }

      const clienteExiste = clientes.some(c => c.id === clienteId);
      if (!clienteExiste) {
        throw new Error(`Cliente com ID ${clienteId} não encontrado`);
      }

      const investimento = {
        clienteId: clienteId,
        tipoInvestimento: item['Tipo Investimento'],
        modalidade: item['Modalidade'],
        titulo: item['Título'],
        valorAporte: parseFloat(item['Valor do Aporte']),
        dataAporte: item['Data do Aporte'],
        dataVencimento: item['Data do Vencimento'],
        ipcaAtual: parseFloat(item['IPCA Atual']),
        selicAtual: parseFloat(item['Selic Atual']),
        taxaPreFixado: item['Taxa Pré Fixado'] ? parseFloat(item['Taxa Pré Fixado']) : undefined,
        taxaPosCDI: item['Taxa Pós CDI'] ? parseFloat(item['Taxa Pós CDI']) : undefined,
        taxaIPCA: item['Taxa IPCA'] ? parseFloat(item['Taxa IPCA']) : undefined
      };

      adicionarInvestimento(investimento);
      sucessos++;
    } catch (error) {
      console.error("Erro ao processar item:", error, item);
      falhas++;
    }
  });

  toast({
    title: "Importação concluída",
    description: `${sucessos} investimento(s) importado(s) com sucesso. ${falhas} falha(s).`,
    variant: sucessos > 0 ? "default" : "destructive"
  });

  return { sucessos, falhas };
};

