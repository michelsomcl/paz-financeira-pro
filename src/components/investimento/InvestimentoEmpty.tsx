
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const InvestimentoEmpty: React.FC = () => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6 text-center">
        <p className="text-gray-500">Nenhum investimento cadastrado</p>
      </CardContent>
    </Card>
  );
};

export default InvestimentoEmpty;
