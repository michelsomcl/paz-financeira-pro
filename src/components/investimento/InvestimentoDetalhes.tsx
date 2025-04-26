
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InvestimentoComCalculo } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { formatarDescricaoTaxa } from '@/utils/calculadora';

interface InvestimentoDetalhesProps {
  investimento: InvestimentoComCalculo | null;
  visible: boolean;
  onClose: () => void;
}

const InvestimentoDetalhes: React.FC<InvestimentoDetalhesProps> = ({ 
  investimento, 
  visible, 
  onClose 
}) => {
  if (!investimento) {
    return null;
  }
  
  // Garantir valores válidos ou usar zero como fallback
  const valorAporte = investimento.valorAporte || 0;
  const rendimentoLiquido = investimento.calculo?.rendimentoLiquido || 0;
  const montanteFinal = valorAporte + rendimentoLiquido;
  
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Investimento</DialogTitle>
          <DialogDescription>
            Cliente: {investimento.clienteNome} | Plano: {investimento.planoContratado}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-azul-dark">Informações Gerais</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm text-gray-500">Tipo de Investimento:</div>
                <div className="text-sm font-medium">{investimento.tipoInvestimento}</div>
                
                <div className="text-sm text-gray-500">Modalidade:</div>
                <div className="text-sm font-medium">{investimento.modalidade}</div>
                
                <div className="text-sm text-gray-500">Taxa Aplicada:</div>
                <div className="text-sm font-medium">{formatarDescricaoTaxa(investimento)}</div>
                
                <div className="text-sm text-gray-500">Data do Aporte:</div>
                <div className="text-sm font-medium">{investimento.dataAporte}</div>
                
                <div className="text-sm text-gray-500">Data do Vencimento:</div>
                <div className="text-sm font-medium">{investimento.dataVencimento}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-azul-dark">Parâmetros de Cálculo</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm text-gray-500">Valor do Aporte:</div>
                <div className="text-sm font-medium">{formatCurrency(valorAporte)}</div>
                
                <div className="text-sm text-gray-500">Taxa Efetiva:</div>
                <div className="text-sm font-medium">{formatPercentage(investimento.calculo?.taxaEfetiva)}</div>
                
                <div className="text-sm text-gray-500">IPCA Atual:</div>
                <div className="text-sm font-medium">{formatPercentage(investimento.ipcaAtual)}</div>
                
                <div className="text-sm text-gray-500">SELIC Atual:</div>
                <div className="text-sm font-medium">{formatPercentage(investimento.selicAtual)}</div>
                
                <div className="text-sm text-gray-500">Dias Úteis:</div>
                <div className="text-sm font-medium">{investimento.calculo?.diasUteis || 0}</div>
                
                <div className="text-sm text-gray-500">Dias Corridos:</div>
                <div className="text-sm font-medium">{investimento.calculo?.diasCorridos || 0}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-azul-dark">Resultados</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm text-gray-500">Montante Bruto:</div>
                <div className="text-sm font-medium">{formatCurrency(investimento.calculo?.montanteValorBruto)}</div>
                
                <div className="text-sm text-gray-500">Rendimento Bruto:</div>
                <div className="text-sm font-medium">{formatCurrency(investimento.calculo?.rendimentoBruto)}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-azul-dark">Impostos</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['LCI', 'LCA', 'LCD'].includes(investimento.tipoInvestimento) ? (
                  <div className="col-span-2 text-sm font-medium text-green-600">
                    Investimento isento de impostos
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-500">Alíquota IR:</div>
                    <div className="text-sm font-medium">{formatPercentage(investimento.calculo?.aliquotaIR)}</div>
                    
                    <div className="text-sm text-gray-500">Valor IR:</div>
                    <div className="text-sm font-medium">{formatCurrency(investimento.calculo?.valorIR)}</div>
                    
                    <div className="text-sm text-gray-500">Valor IOF:</div>
                    <div className="text-sm font-medium">{formatCurrency(investimento.calculo?.valorIOF)}</div>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-azul-dark">Resultado Final</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm text-gray-500">Valor Inicial:</div>
                <div className="text-sm font-medium">{formatCurrency(valorAporte)}</div>
                
                <div className="text-sm text-gray-500">Rendimento Líquido:</div>
                <div className="text-sm font-medium">{formatCurrency(rendimentoLiquido)}</div>
                
                <div className="text-sm text-gray-500">Montante Final:</div>
                <div className="text-sm font-semibold text-azul-dark">
                  {formatCurrency(montanteFinal)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="bg-azul hover:bg-azul-dark">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestimentoDetalhes;
