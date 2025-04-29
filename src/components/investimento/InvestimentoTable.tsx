
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { formatarDescricaoTaxa } from '@/utils/calculadora';
import { InvestimentoComCalculo } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface InvestimentoTableProps {
  investimentos: InvestimentoComCalculo[];
  onDelete: (id: string) => void;
  onShowDetails: (investimento: InvestimentoComCalculo) => void;
}

const InvestimentoTable: React.FC<InvestimentoTableProps> = ({
  investimentos,
  onDelete,
  onShowDetails,
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
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1300px]"> {/* largura mínima fixa para evitar quebra */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor do Aporte</TableHead>
              <TableHead>Data do Aporte</TableHead>
              <TableHead>Data do Vencimento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Taxa Utilizada</TableHead>
              <TableHead>Dias Corridos</TableHead>
              <TableHead>Dias Úteis</TableHead>
              <TableHead>Rent. Bruta</TableHead>
              <TableHead>IR</TableHead>
              <TableHead>IOF</TableHead>
              <TableHead>Rent. Líquida</TableHead>
              <TableHead>Patrimônio Líquido</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investimentos.map((investimento) => {
              // Skip rendering if investimento is invalid
              if (!investimento || !investimento.id) {
                console.error("Invalid investimento found:", investimento);
                return null;
              }

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
                <TableRow 
                  key={investimento.id} 
                  className="whitespace-nowrap" // Impede quebra de linha
                >
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
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-blue-500 border-blue-200 hover:bg-blue-50"
                        onClick={() => onShowDetails(investimento)}
                      >
                        <Info size={16} />
                        <span className="sr-only">Detalhes</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este investimento? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDelete(investimento.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvestimentoTable;
