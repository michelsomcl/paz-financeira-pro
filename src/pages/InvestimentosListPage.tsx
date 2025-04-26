
import React from 'react';
import Layout from '@/components/layout/Layout';
import InvestimentoList from '@/components/investimento/InvestimentoList';
import { useIsMobile } from '@/hooks/use-mobile';

const InvestimentosListPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Layout 
      title="Investimentos" 
      subtitle="Visualize e gerencie todos os investimentos cadastrados"
    >
      <div className={`space-y-6 ${isMobile ? "px-2" : ""}`}>
        <InvestimentoList />
      </div>
    </Layout>
  );
};

export default InvestimentosListPage;
