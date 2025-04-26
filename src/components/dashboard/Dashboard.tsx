
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { StatisticsCards } from './StatisticsCards';
import { ClientFilter } from './ClientFilter';
import { ReturnsByTimeChart } from './ReturnsByTimeChart';
import { ModalityDistributionChart } from './ModalityDistributionChart';

const Dashboard: React.FC = () => {
  const { clientes, investimentos } = useAppContext();
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);
  
  const investimentosFiltrados = clienteSelecionado 
    ? investimentos.filter(inv => inv.clienteId === clienteSelecionado)
    : investimentos;
  
  const totalClientes = clientes.length;
  const totalInvestimentos = investimentosFiltrados.length;
  
  const valorTotalInvestido = investimentosFiltrados.reduce(
    (total, inv) => total + (Number(inv.valorAporte) || 0), 
    0
  );
  
  const rendimentoTotalBruto = investimentosFiltrados.reduce(
    (total, inv) => {
      const rendimento = inv.calculo?.rendimentoBruto || 0;
      return total + (Number(rendimento) || 0);
    },
    0
  );
  
  const rendimentoTotalLiquido = investimentosFiltrados.reduce(
    (total, inv) => {
      const rendimento = inv.calculo?.rendimentoLiquido || 0;
      return total + (Number(rendimento) || 0);
    },
    0
  );

  const patrimonioLiquido = investimentosFiltrados.reduce(
    (total, inv) => {
      const valorAporte = Number(inv.valorAporte) || 0;
      const rendimento = inv.calculo?.rendimentoLiquido || 0;
      return total + valorAporte + (Number(rendimento) || 0);
    },
    0
  );

  const dadosPorModalidade = investimentosFiltrados.reduce((acc, inv) => {
    const modalidade = inv.modalidade;
    if (!acc[modalidade]) {
      acc[modalidade] = {
        name: modalidade,
        value: 0
      };
    }
    acc[modalidade].value += (Number(inv.valorAporte) || 0);
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const dadosGraficoPizza = Object.values(dadosPorModalidade);

  const handleClienteChange = (value: string) => {
    setClienteSelecionado(value === "todos" ? null : value);
  };

  return (
    <div className="space-y-6">
      <ClientFilter 
        clientes={clientes}
        clienteSelecionado={clienteSelecionado}
        onClienteChange={handleClienteChange}
      />
      
      <StatisticsCards
        totalClientes={totalClientes}
        totalInvestimentos={totalInvestimentos}
        valorTotalInvestido={valorTotalInvestido}
        rendimentoTotalLiquido={rendimentoTotalLiquido}
        patrimonioLiquido={patrimonioLiquido}
      />
      
      {/* Layout dos gráficos lado a lado */}
      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 w-full">
          <ReturnsByTimeChart 
            data={[]} 
            investimentosFiltrados={investimentosFiltrados}
          />
        </div>
        <div className="md:w-1/2 w-full">
          <ModalityDistributionChart data={dadosGraficoPizza} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
