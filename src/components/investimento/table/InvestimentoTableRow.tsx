
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { InvestimentoComCalculo } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { formatarDescricaoTaxa } from '@/utils/calculadora';
import TableActions from './TableActions';

interface InvestimentoTableRowProps {
  investimento: InvestimentoComCalculo;
  onDelete: (id: string) => void;
  onShowDetails: (investimento: InvestimentoComCalculo) => void;
}

const InvestimentoTableRow: React.FC<InvestimentoTableRowProps> = ({
  investimento,
  onDelete,
  onShowDetails,
}) => {
  // Garantir que temos valores válidos ou usar zero como fallback
  const valorAporte = Number(investimento.valorAporte) || 0;
  
  // Ensure calculo exists before accessing its properties
  const calculo = investimento.calculo || {
    diasCorridos: 0,
    diasUteis: 0,
    rendimentoBruto: 0,
    valorIR: 0,
    valorIOF: 0,
    rendimentoLiquido: 0
  };
  
  const rendimentoLiquido = Number(calculo.rendimentoLiquido) || 0;
  const rendimentoBruto = Number(calculo.rendimentoBruto) || 0;
  const valorIR = Number(calculo.valorIR) || 0;
  const valorIOF = Number(calculo.valorIOF) || 0;
  const diasCorridos = Number(calculo.diasCorridos) || 0;
  const diasUteis = Number(calculo.diasUteis) || 0;
  const patrimonioLiquido = valorAporte + rendimentoLiquido;
  
  return (
    <TableRow className="whitespace-nowrap">
      <TableCell className="font-medium whitespace-nowrap">{investimento.clienteNome || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{formatCurrency(valorAporte)}</TableCell>
      <TableCell className="whitespace-nowrap">{investimento.dataAporte || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{investimento.dataVencimento || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{investimento.tipoInvestimento || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{investimento.modalidade || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">{investimento.titulo ?? "-"}</TableCell>
      <TableCell className="whitespace-nowrap">
        {investimento ? formatarDescricaoTaxa(investimento) : '-'}
      </TableCell>
      <TableCell className="whitespace-nowrap">{diasCorridos}</TableCell>
      <TableCell className="whitespace-nowrap">{diasUteis}</TableCell>
      <TableCell className="whitespace-nowrap">{formatCurrency(rendimentoBruto)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatCurrency(valorIR)}</TableCell>
      <TableCell className="whitespace-nowrap">{formatCurrency(valorIOF)}</TableCell>
      <TableCell className="font-medium whitespace-nowrap">{formatCurrency(rendimentoLiquido)}</TableCell>
      <TableCell className="font-medium whitespace-nowrap">{formatCurrency(patrimonioLiquido)}</TableCell>
      <TableCell className="text-right whitespace-nowrap">
        <TableActions 
          investimento={investimento}
          onDelete={onDelete}
          onShowDetails={onShowDetails}
        />
      </TableCell>
    </TableRow>
  );
};

export default InvestimentoTableRow;
