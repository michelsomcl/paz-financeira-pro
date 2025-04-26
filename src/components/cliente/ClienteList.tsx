
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Pencil } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface NotesState {
  [key: string]: string;
}

const ClienteList: React.FC = () => {
  const { clientes, excluirCliente, investimentos } = useAppContext();
  const [notes, setNotes] = useState<NotesState>({});
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

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

  if (clientes.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum cliente cadastrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Clientes Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Plano Contratado</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Início do Plano</TableHead>
                <TableHead>Contribuição Inicial</TableHead>
                <TableHead>Valor Total Aplicado</TableHead>
                <TableHead>Patrimônio Projetado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => {
                const { valorAplicado, patrimonioProjetado } = calcularValoresConsolidados(cliente.id);
                return (
                  <TableRow key={cliente.id} className="whitespace-nowrap">
                    <TableCell className="font-medium whitespace-nowrap">{cliente.nome}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.planoContratado}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.vigenciaPlano}</TableCell>
                    <TableCell className="whitespace-nowrap">{cliente.inicioPlano ?? '-'}</TableCell>
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

