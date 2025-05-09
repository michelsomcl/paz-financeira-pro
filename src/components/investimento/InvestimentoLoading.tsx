
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const InvestimentoLoading: React.FC = () => {
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
};

export default InvestimentoLoading;
