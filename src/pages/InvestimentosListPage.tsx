
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import InvestimentoList from '@/components/investimento/InvestimentoList';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';

const InvestimentosListPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const { investimentos } = useAppContext();
  
  // Add a controlled loading state with delay to prevent flickering
  useEffect(() => {
    // Short timeout to ensure stable rendering
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(loadingTimeout);
  }, [investimentos]);
  
  return (
    <Layout 
      title="Investimentos" 
      subtitle="Visualize e gerencie todos os investimentos cadastrados"
    >
      <div className={`space-y-6 ${isMobile ? "px-2" : ""}`}>
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <InvestimentoList />
        )}
      </div>
    </Layout>
  );
};

export default InvestimentosListPage;
