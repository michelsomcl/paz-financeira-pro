
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InvestimentoComCalculo } from '@/types';
import InvestimentoFilters from './InvestimentoFilters';
import InvestimentoTable from './InvestimentoTable';
import InvestimentoExport from './InvestimentoExport';
import InvestimentoDetalhes from './InvestimentoDetalhes';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const InvestimentoList: React.FC = () => {
  const { investimentos, excluirInvestimento, clientes } = useAppContext();
  const isMobile = useIsMobile();
  
  const [filtroCliente, setFiltroCliente] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroModalidade, setFiltroModalidade] = useState<string | null>(null);
  
  const [detalhesVisible, setDetalhesVisible] = useState(false);
  const [investimentoSelecionado, setInvestimentoSelecionado] = useState<InvestimentoComCalculo | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Refresh data on component mount without causing flicker
  useEffect(() => {
    if (investimentos.length > 0) {
      // Data is already loaded, no need for refresh
      return;
    }
    
    refreshData();
  }, [investimentos]);
  
  const refreshData = async () => {
    try {
      setIsLoadingData(true);
      
      // Trigger data refresh through custom event
      const evento = new CustomEvent("refresh-data");
      window.dispatchEvent(evento);
      
      // Set a timeout to ensure we give the refresh event time to process
      setTimeout(() => {
        setIsLoadingData(false);
      }, 800);
    } catch (error) {
      console.error("Error refreshing investments:", error);
      setIsLoadingData(false);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível atualizar os investimentos",
        variant: "destructive"
      });
    }
  };
  
  const handleImportData = (data: any[]) => {
    // Após a importação bem-sucedida, atualize a lista
    refreshData();
  };
  
  const investimentosFiltrados = investimentos.filter(inv => {
    // Ensure inv is valid before filtering
    if (!inv) return false;
    
    const matchCliente = !filtroCliente || inv.clienteId === filtroCliente;
    const matchTipo = !filtroTipo || inv.tipoInvestimento === filtroTipo;
    const matchModalidade = !filtroModalidade || inv.modalidade === filtroModalidade;
    return matchCliente && matchTipo && matchModalidade;
  });
  
  const exibirDetalhes = (investimento: InvestimentoComCalculo) => {
    setInvestimentoSelecionado(investimento);
    setDetalhesVisible(true);
  };
  
  if (isLoadingData) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Investimentos Cadastrados</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!Array.isArray(investimentos) || investimentos.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum investimento cadastrado</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={`${isMobile ? "px-2" : ""} w-full`}>
      <InvestimentoFilters 
        clientes={clientes}
        filtroCliente={filtroCliente}
        filtroTipo={filtroTipo}
        filtroModalidade={filtroModalidade}
        onClienteChange={setFiltroCliente}
        onTipoChange={setFiltroTipo}
        onModalidadeChange={setFiltroModalidade}
      />
      
      <Card className="animate-fade-in">
        <CardHeader className={`flex ${isMobile ? "flex-col" : "flex-row"} items-center justify-between`}>
          <div>
            <CardTitle>Investimentos Cadastrados</CardTitle>
            <CardDescription>
              {investimentosFiltrados.length} investimento(s) encontrado(s)
            </CardDescription>
          </div>
          <div className={isMobile ? "mt-4 w-full" : ""}>
            <InvestimentoExport 
              investimentos={investimentosFiltrados} 
              onImport={handleImportData}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto w-full">
            <InvestimentoTable 
              investimentos={investimentosFiltrados}
              onDelete={excluirInvestimento}
              onShowDetails={exibirDetalhes}
            />
          </div>
        </CardContent>
      </Card>
      
      <InvestimentoDetalhes 
        investimento={investimentoSelecionado} 
        visible={detalhesVisible}
        onClose={() => setDetalhesVisible(false)}
      />
    </div>
  );
};

export default InvestimentoList;
