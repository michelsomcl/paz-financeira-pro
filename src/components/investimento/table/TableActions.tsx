
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { InvestimentoComCalculo } from '@/types';

interface TableActionsProps {
  investimento: InvestimentoComCalculo;
  onDelete: (id: string) => void;
  onShowDetails: (investimento: InvestimentoComCalculo) => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  investimento,
  onDelete,
  onShowDetails,
}) => {
  return (
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
  );
};

export default TableActions;
