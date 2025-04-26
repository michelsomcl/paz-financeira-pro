
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Cliente } from '@/types';

interface ClientFilterProps {
  clientes: Cliente[];
  clienteSelecionado: string | null;
  onClienteChange: (value: string) => void;
}

export const ClientFilter: React.FC<ClientFilterProps> = ({
  clientes,
  clienteSelecionado,
  onClienteChange,
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Filtrar por Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-xs">
          <Label htmlFor="clienteSelect">Selecione um cliente</Label>
          <Select 
            value={clienteSelecionado || "todos"} 
            onValueChange={(value) => onClienteChange(value)}
          >
            <SelectTrigger id="clienteSelect">
              <SelectValue placeholder="Todos os clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os clientes</SelectItem>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
