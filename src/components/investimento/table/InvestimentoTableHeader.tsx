
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import SortableHeader from './SortableHeader';

interface InvestimentoTableHeaderProps {
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (field: string) => void;
}

const InvestimentoTableHeader: React.FC<InvestimentoTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
      <TableRow>
        <SortableHeader field="clienteNome" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Cliente</SortableHeader>
        <SortableHeader field="valorAporte" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Valor do Aporte</SortableHeader>
        <SortableHeader field="dataAporte" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Data do Aporte</SortableHeader>
        <SortableHeader field="dataVencimento" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Data do Vencimento</SortableHeader>
        <SortableHeader field="tipoInvestimento" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Tipo</SortableHeader>
        <SortableHeader field="modalidade" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Modalidade</SortableHeader>
        <SortableHeader field="titulo" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Título</SortableHeader>
        <TableHead className="whitespace-nowrap">Taxa Utilizada</TableHead>
        <SortableHeader field="calculo.diasCorridos" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Dias Corridos</SortableHeader>
        <SortableHeader field="calculo.diasUteis" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Dias Úteis</SortableHeader>
        <SortableHeader field="calculo.rendimentoBruto" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Rent. Bruta</SortableHeader>
        <SortableHeader field="calculo.valorIR" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>IR</SortableHeader>
        <SortableHeader field="calculo.valorIOF" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>IOF</SortableHeader>
        <SortableHeader field="calculo.rendimentoLiquido" sortField={sortField} sortDirection={sortDirection} onSort={onSort}>Rent. Líquida</SortableHeader>
        <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default InvestimentoTableHeader;
