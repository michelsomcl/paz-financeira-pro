
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cliente, Modalidade, TipoInvestimento } from '@/types';

interface InvestimentoFiltersProps {
  clientes: Cliente[];
  filtroCliente: string | null;
  filtroTipo: string | null;
  filtroModalidade: string | null;
  onClienteChange: (value: string | null) => void;
  onTipoChange: (value: string | null) => void;
  onModalidadeChange: (value: string | null) => void;
}

const InvestimentoFilters: React.FC<InvestimentoFiltersProps> = ({
  clientes,
  filtroCliente,
  filtroTipo,
  filtroModalidade,
  onClienteChange,
  onTipoChange,
  onModalidadeChange,
}) => {
  return (
    <Card className="mb-6 animate-fade-in">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>Filtre a lista de investimentos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filtroCliente">Cliente</Label>
            <Select 
              value={filtroCliente || "todos"} 
              onValueChange={(value) => onClienteChange(value === "todos" ? null : value)}
            >
              <SelectTrigger id="filtroCliente">
                <SelectValue placeholder="Todos os clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filtroTipo">Tipo de Investimento</Label>
            <Select 
              value={filtroTipo || "todos"} 
              onValueChange={(value) => onTipoChange(value === "todos" ? null : value)}
            >
              <SelectTrigger id="filtroTipo">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="CDB">CDB</SelectItem>
                <SelectItem value="LCI">LCI</SelectItem>
                <SelectItem value="LCA">LCA</SelectItem>
                <SelectItem value="LCD">LCD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filtroModalidade">Modalidade</Label>
            <Select 
              value={filtroModalidade || "todas"} 
              onValueChange={(value) => onModalidadeChange(value === "todas" ? null : value)}
            >
              <SelectTrigger id="filtroModalidade">
                <SelectValue placeholder="Todas as modalidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Pré Fixado">Pré Fixado</SelectItem>
                <SelectItem value="Pós Fixado">Pós Fixado</SelectItem>
                <SelectItem value="IPCA+">IPCA+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestimentoFilters;
