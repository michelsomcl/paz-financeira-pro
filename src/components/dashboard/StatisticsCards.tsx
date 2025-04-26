
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface StatisticsCardsProps {
  totalClientes: number;
  totalInvestimentos: number;
  valorTotalInvestido: number;
  rendimentoTotalLiquido: number;
  patrimonioLiquido: number;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalClientes,
  totalInvestimentos,
  valorTotalInvestido,
  rendimentoTotalLiquido,
  patrimonioLiquido,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <Card className="col-span-1 animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClientes}</div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Investimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInvestimentos}</div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Valor Total Investido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(valorTotalInvestido)}</div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Rendimento Total Líquido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(rendimentoTotalLiquido)}</div>
        </CardContent>
      </Card>

      <Card className="col-span-1 animate-fade-in bg-[linear-gradient(135deg,#E5DEFF_80%,#9b87f5_100%)] border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[var(--purple-700,#6E59A5)]">
            Patrimônio Líquido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--purple-800,#403E43)]">{formatCurrency(patrimonioLiquido)}</div>
        </CardContent>
      </Card>
    </div>
  );
};
