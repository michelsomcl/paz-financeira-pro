
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

// Paleta de cores padronizada e destacada do sistema
const CORES_PIZZA = [
  '#d3ad4d',  // dourado
  '#1a365d',  // azul escuro
  '#4299e1',  // azul claro
  '#e6c97a',  // dourado claro
  '#8B5CF6',  // lilás vivo
  '#2b6cb0',  // azul normal
  '#b18d28',  // dourado escuro
  '#D6BCFA',  // lilás claro
  '#1A1F2C',  // roxo escuro
];

interface ModalityDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export const ModalityDistributionChart: React.FC<ModalityDistributionChartProps> = ({ data }) => {
  return (
    <Card className="animate-fade-in h-full w-full">
      <CardHeader>
        <CardTitle>Distribuição por Modalidade</CardTitle>
      </CardHeader>
      <CardContent className="h-[230px] flex flex-col justify-between items-center">
        {data.length > 0 ? (
          <ResponsiveContainer width="98%" height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={68}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Sem dados para exibir
          </div>
        )}
      </CardContent>
    </Card>
  );
};
