
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Pencil, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface NotesState {
  [key: string]: string;
}

// Define sorting types
type SortField = string | null;
type SortDirection = 'asc' | 'desc' | null;

const ClienteList: React.FC = () => {
  const { clientes, excluirCliente, investimentos } = useAppContext();
  const [notes, setNotes] = useState<NotesState>({});
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleNotesChange = (clienteId: string, value: string) => {
    setNotes(prev => ({
      ...prev,
      [clienteId]: value
    }));
  };

  const calcularValoresConsolidados = (clienteId: string) => {
    const investimentosCliente = investimentos.filter(inv => inv.clienteId === clienteId);
    const valorAplicado = investimentosCliente.reduce((total, inv) => total + inv.valorAporte, 0);
    const patrimonioProjetado = investimentosCliente.reduce((total, inv) => {
      const rendimentoLiquido = inv.calculo?.rendimentoLiquido || 0;
      return total + inv.valorAporte + rendimentoLiquido;
    }, 0);
    
    return { valorAplicado, patrimonioProjetado };
  };

  const handleSort = (field: string) => {
    // If already sorting by this field, cycle through: asc -> desc -> null
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      // New field, start with ascending sort
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-1 h-4 w-4 inline" />;
    } else if (sortDirection === 'desc') {
      return <ArrowDown className="ml-1 h-4 w-4 inline" />;
    }
    return null;
  };

  const getSortedClientes = () => {
    if (!sortField || !sortDirection || clientes.length === 0) return clientes;
    
    return [...clientes].sort((a, b) => {
      // Helper function to get value from nested properties
      const getValue = (obj: any, path: string) => {
        const parts = path.split('.');
        let value = obj;
        for (const part of parts) {
          if (!value) return null;
          value = value[part];
        }
        
        return value;
      };
      
      let valueA = getValue(a, sortField);
      let valueB = getValue(b, sortField);
      
      // Handle specific field types
      if (sortField === 'inicioPlano' || sortField === 'vencimento') {
        // Parse dates in format MM/YYYY
        const parseDateMonthYear = (dateStr: string | null | undefined) => {
          if (!dateStr) return null;
          const [month, year] = dateStr.split('/');
          if (month && year) {
            return new Date(parseInt(year), parseInt(month) - 1, 1).getTime();
          }
          return null;
        };
        
        const dateA = parseDateMonthYear(valueA);
        const dateB = parseDateMonthYear(valueB);
        
        if (dateA !== null && dateB !== null) {
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
      }
      
      // Handle numeric values
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      // Handle string values that might be numbers (e.g., currency)
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Try to parse as numbers for currency values
        const numA = parseFloat(valueA.replace(/[^0-9,-]/g, '').replace(',', '.'));
        const numB = parseFloat(valueB.replace(/[^0-9,-]/g, '').replace(',', '.'));
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === 'asc' ? numA - numB : numB - numA;
        }
        
        // Case-insensitive string comparison
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB, 'pt-BR') 
          : valueB.localeCompare(valueA, 'pt-BR');
      }
      
      // Fallback comparison
      if (valueA === valueB) return 0;
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      return sortDirection === 'asc' ? 1 : -1;
    });
  };

  if (clientes.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum cliente cadastrado</p>
        </CardContent>
      </Card>
    );
  }

  const sortedClientes = getSortedClientes();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Clientes Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('nome')}
                >
                  Nome {renderSortIcon('nome')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('planoContratado')}
                >
                  Plano Contratado {renderSortIcon('planoContratado')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('vigenciaPlano')}
                >
                  Vigência {renderSortIcon('vigenciaPlano')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('inicioPlano')}
                >
                  Início do Plano {renderSortIcon('inicioPlano')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('vencimento')}
                >
                  Vencimento {renderSortIcon('vencimento')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('contribuicao')}
                >
                  Contribuição Inicial {renderSortIcon('contribuicao')}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50">
                  Valor Total Aplicado
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50">
                  Patrimônio Projetado
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClientes.map((cliente) => {
                const { valorAplicado, patrimonioProjetado } = calcularValoresConsolidados(cliente.id);
                return (
                  <TableRow key={cliente.id} className="whitespace-nowrap">
                    <TableCell className="font-medium whitespace-nowrap">{cliente.nome}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.planoContratado}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.vigenciaPlano}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.inicioPlano ?? '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.vencimento ?? '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(cliente.contribuicao)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(valorAplicado)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatCurrency(patrimonioProjetado)}</TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Dialog open={openDialogId === cliente.id} onOpenChange={(open) => setOpenDialogId(open ? cliente.id : null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-blue-500 border-blue-200 hover:bg-blue-50"
                          >
                            <Pencil size={16} />
                            <span className="sr-only">Anotações</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Anotações - {cliente.nome}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <Textarea
                              value={notes[cliente.id] || ''}
                              onChange={(e) => handleNotesChange(cliente.id, e.target.value)}
                              placeholder="Digite suas anotações aqui..."
                              className="min-h-[200px]"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => excluirCliente(cliente.id)}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClienteList;
