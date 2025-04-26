
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ReturnsByTimeChartProps {
  data: Array<{
    data: string;
    rendimentoTotal: number;
  }>;
  investimentosFiltrados: Array<{
    dataAporte: string;
    valorAporte: number;
    calculo: {
      rendimentoLiquido: number;
    };
  }>;
}

export const ReturnsByTimeChart: React.FC<ReturnsByTimeChartProps> = ({ 
  investimentosFiltrados 
}) => {
  const dadosGrafico = React.useMemo(() => {
    const investimentosPorData = investimentosFiltrados.reduce((acc, inv) => {
      try {
        if (!inv.dataAporte) {
          console.warn('Data de aporte inválida', inv);
          return acc;
        }

        let data;
        if (typeof inv.dataAporte === 'string' && inv.dataAporte.includes('/')) {
          const [dia, mes, ano] = inv.dataAporte.split('/');
          const anoCompleto = ano && ano.length === 2 ? `20${ano}` : ano;
          if (dia && mes && anoCompleto) {
            data = new Date(`${anoCompleto}-${mes}-${dia}`);
          }
        } else if (inv.dataAporte) {
          data = new Date(inv.dataAporte);
        }

        if (!data || isNaN(data.getTime())) {
          console.warn('Data inválida encontrada:', inv.dataAporte);
          return acc;
        }

        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const chave = `${ano}-${String(mes).padStart(2, '0')}`;
        
        if (!acc[chave]) {
          acc[chave] = {
            data: chave,
            totalAportes: 0,
            totalRendimentos: 0,
          };
        }
        
        const valorAporte = Number(inv.valorAporte) || 0;
        const rendimento = (inv.calculo && inv.calculo.rendimentoLiquido) 
          ? Number(inv.calculo.rendimentoLiquido) || 0 
          : 0;
        
        acc[chave].totalAportes += valorAporte;
        acc[chave].totalRendimentos += rendimento;
      } catch (error) {
        console.error('Erro ao processar data:', error);
      }
      return acc;
    }, {} as Record<string, { 
      data: string; 
      totalAportes: number;
      totalRendimentos: number;
    }>);

    return Object.values(investimentosPorData)
      .sort((a, b) => a.data.localeCompare(b.data));
  }, [investimentosFiltrados]);

  return (
    <Card className="col-span-4 md:col-span-2 lg:col-span-2 animate-fade-in">
      <CardHeader>
        <CardTitle>Rendimento por Período</CardTitle>
      </CardHeader>
      <CardContent className="h-[230px]">
        {dadosGrafico.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosGrafico}
              margin={{ top: 10, right: 35, left: 30, bottom: 10 }}
              barCategoryGap="60%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="data" 
                tickFormatter={(value) => {
                  if (!value || typeof value !== 'string') return '';
                  const parts = value.split('-');
                  if (parts.length !== 2) return '';
                  const [ano, mes] = parts;
                  return `${mes}/${ano}`;
                }}
              />
              <YAxis 
                width={100}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => {
                  if (!label || typeof label !== 'string') return '';
                  const parts = label.split('-');
                  if (parts.length !== 2) return '';
                  const [ano, mes] = parts;
                  return `${mes}/${ano}`;
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Bar 
                dataKey="totalAportes" 
                name="Total Investido" 
                stackId="a"
                fill="#2b6cb0"
                barSize={10}
              />
              <Bar 
                dataKey="totalRendimentos" 
                name="Rendimento Total" 
                stackId="a"
                fill="#d3ad4d"
                barSize={10}
              />
            </BarChart>
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
