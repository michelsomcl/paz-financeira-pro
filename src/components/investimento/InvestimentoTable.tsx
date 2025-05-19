
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { InvestimentoComCalculo } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import InvestimentoTableHeader from './table/InvestimentoTableHeader';
import InvestimentoTableRow from './table/InvestimentoTableRow';

interface InvestimentoTableProps {
  investimentos: InvestimentoComCalculo[];
  onDelete: (id: string) => void;
  onShowDetails: (investimento: InvestimentoComCalculo) => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (field: string) => void;
}

const InvestimentoTable: React.FC<InvestimentoTableProps> = ({
  investimentos,
  onDelete,
  onShowDetails,
  sortField,
  sortDirection,
  onSort,
}) => {
  const isMobile = useIsMobile();

  // Check if investimentos is valid
  if (!investimentos || !Array.isArray(investimentos) || investimentos.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>Nenhum investimento encontrado</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ScrollArea className="w-full">
        <div className="min-w-[1400px]"> {/* aumentando a largura mínima para acomodar todas as colunas */}
          <Table>
            <InvestimentoTableHeader 
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <TableBody>
              {investimentos.map((investimento) => {
                // Skip rendering if investimento is invalid
                if (!investimento || !investimento.id) {
                  console.error("Invalid investimento found:", investimento);
                  return null;
                }
                
                return (
                  <InvestimentoTableRow
                    key={investimento.id}
                    investimento={investimento}
                    onDelete={onDelete}
                    onShowDetails={onShowDetails}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default InvestimentoTable;
