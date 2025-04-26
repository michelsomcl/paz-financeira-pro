import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters';

const ClienteForm: React.FC = () => {
  const { adicionarCliente } = useAppContext();
  
  const [nome, setNome] = useState('');
  const [planoContratado, setPlanoContratado] = useState('');
  const [vigenciaPlano, setVigenciaPlano] = useState('');
  const [inicioPlano, setInicioPlano] = useState('');
  const [contribuicao, setContribuicao] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !planoContratado || !vigenciaPlano || !inicioPlano || !contribuicao) {
      return;
    }
    
    adicionarCliente({
      nome,
      planoContratado,
      vigenciaPlano,
      inicioPlano,
      contribuicao: parseFloat(contribuicao) || 0
    });
    
    setNome('');
    setPlanoContratado('');
    setVigenciaPlano('');
    setInicioPlano('');
    setContribuicao('');
  };

  const handleContribuicaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.,]/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setContribuicao(value);
    }
  };

  const handleVigenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVigenciaPlano(e.target.value);
  };

  const handleInicioPlanoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9/]*$/.test(value)) {
      let formatted = value.replace(/\//g, '');
      if (formatted.length > 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 6);
      }
      setInicioPlano(formatted);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Cliente</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="planoContratado">Plano Contratado</Label>
              <Input
                id="planoContratado"
                value={planoContratado}
                onChange={(e) => setPlanoContratado(e.target.value)}
                placeholder="Plano"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vigenciaPlano">Vigência do Plano</Label>
              <Input
                id="vigenciaPlano"
                type="text"
                value={vigenciaPlano}
                onChange={handleVigenciaChange}
                placeholder="Informe a vigência"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inicioPlano">Início do Plano</Label>
              <Input
                id="inicioPlano"
                type="text"
                value={inicioPlano}
                onChange={handleInicioPlanoChange}
                placeholder="mm/aaaa"
                maxLength={7}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribuicao">Contribuição Inicial</Label>
              <Input
                id="contribuicao"
                type="text"
                value={contribuicao}
                onChange={handleContribuicaoChange}
                placeholder="0,00"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-dourado hover:bg-dourado-dark">
              Cadastrar Cliente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClienteForm;
