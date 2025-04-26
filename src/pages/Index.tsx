
import React from 'react';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';

const Index: React.FC = () => {
  return (
    <Layout 
      title="Dashboard" 
      subtitle="Visão geral dos investimentos e resultados"
    >
      <Dashboard />
    </Layout>
  );
};

export default Index;
