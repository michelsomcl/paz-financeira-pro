
import React from 'react';
import Layout from '@/components/layout/Layout';
import ClienteForm from '@/components/cliente/ClienteForm';
import ClienteList from '@/components/cliente/ClienteList';

const ClientesPage: React.FC = () => {
  return (
    <Layout 
      title="Cadastro de Clientes" 
      subtitle="Gerencie os clientes do sistema"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Novo Cliente</h2>
          <ClienteForm />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Clientes Cadastrados</h2>
          <ClienteList />
        </div>
      </div>
    </Layout>
  );
};

export default ClientesPage;
