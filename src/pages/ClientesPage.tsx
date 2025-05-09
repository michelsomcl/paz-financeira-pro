
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ClienteForm from '@/components/cliente/ClienteForm';
import ClienteList from '@/components/cliente/ClienteList';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ClientesPage: React.FC = () => {
  const { investimentos, clientes } = useAppContext();
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout 
      title="Cadastro de Clientes" 
      subtitle="Gerencie os clientes do sistema"
    >
      <div className="space-y-6">
        <div className="flex space-x-4 border-b">
          <button 
            className={`py-2 px-4 ${activeTab === 'list' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('list')}
          >
            Clientes Cadastrados
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'form' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('form')}
          >
            Novo Cliente
          </button>
        </div>
        
        {activeTab === 'form' ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Novo Cliente</h2>
            <ClienteForm />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Clientes Cadastrados</h2>
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ClienteList />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClientesPage;
