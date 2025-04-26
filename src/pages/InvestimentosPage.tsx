
import React from 'react';
import Layout from '@/components/layout/Layout';
import InvestimentoForm from '@/components/investimento/InvestimentoForm';
import { useIsMobile } from '@/hooks/use-mobile';

const InvestimentosPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Layout 
      title="Cadastro de Investimentos" 
      subtitle="Registre novos investimentos no sistema"
    >
      <div className={`space-y-6 ${isMobile ? "px-2" : ""}`}>
        <InvestimentoForm />
      </div>
    </Layout>
  );
};

export default InvestimentosPage;
