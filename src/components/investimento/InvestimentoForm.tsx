import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencyInputMask, dateInputMask, percentageInputMask, parseNumberFromCurrency, validateInvestmentData } from '@/utils/formatters';
import { Modalidade, TipoInvestimento } from '@/types';
import { toast } from '@/hooks/use-toast';

const InvestimentoForm: React.FC = () => {
  const { clientes, adicionarInvestimento } = useAppContext();
  
  const [clienteId, setClienteId] = useState('');
  const [tipoInvestimento, setTipoInvestimento] = useState<TipoInvestimento>('CDB');
  const [modalidade, setModalidade] = useState<Modalidade>('Pré Fixado');

  // Novo campo "Título"
  const [titulo, setTitulo] = useState('');

  const [valorAporte, setValorAporte] = useState('');
  const [dataAporte, setDataAporte] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [ipcaAtual, setIpcaAtual] = useState('');
  const [selicAtual, setSelicAtual] = useState('');
  const [taxaPreFixado, setTaxaPreFixado] = useState('');
  const [taxaPosCDI, setTaxaPosCDI] = useState('');
  const [taxaIPCA, setTaxaIPCA] = useState('');
  
  // Estado para controle de exibição dos campos de taxa conforme modalidade
  const [showTaxaPreFixado, setShowTaxaPreFixado] = useState(true);
  const [showTaxaPosCDI, setShowTaxaPosCDI] = useState(false);
  const [showTaxaIPCA, setShowTaxaIPCA] = useState(false);
  
  // Atualiza os campos de taxa visíveis baseado na modalidade selecionada
  useEffect(() => {
    setShowTaxaPreFixado(modalidade === 'Pré Fixado');
    setShowTaxaPosCDI(modalidade === 'Pós Fixado');
    setShowTaxaIPCA(modalidade === 'IPCA+');
  }, [modalidade]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteId || !dataAporte || !dataVencimento || !valorAporte || !ipcaAtual || !selicAtual) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive"
      });
      return;
    }
    
    // Verifica se a taxa correspondente à modalidade foi preenchida
    if (
      (modalidade === 'Pré Fixado' && !taxaPreFixado) ||
      (modalidade === 'Pós Fixado' && !taxaPosCDI) ||
      (modalidade === 'IPCA+' && !taxaIPCA)
    ) {
      toast({
        title: "Taxa não informada",
        description: "A taxa para a modalidade selecionada deve ser preenchida",
        variant: "destructive"
      });
      return;
    }
    
    // Validar os dados antes de prosseguir
    const valorAporteNumber = parseNumberFromCurrency(valorAporte);
    const validationError = validateInvestmentData(
      valorAporteNumber,
      dataAporte,
      dataVencimento
    );
    
    if (validationError) {
      toast({
        title: "Dados inválidos",
        description: validationError,
        variant: "destructive"
      });
      return;
    }
    
    // Converter string para números antes de enviar para processamento
    const ipcaAtualValue = parseFloat(ipcaAtual.replace(',', '.'));
    const selicAtualValue = parseFloat(selicAtual.replace(',', '.'));
    
    if (isNaN(ipcaAtualValue) || isNaN(selicAtualValue)) {
      toast({
        title: "Valores inválidos",
        description: "IPCA e SELIC devem ser números válidos",
        variant: "destructive"
      });
      return;
    }
    
    // Preparar taxas conforme modalidade
    let taxaPreFixadoValue: number | undefined;
    let taxaPosCDIValue: number | undefined;
    let taxaIPCAValue: number | undefined;
    
    if (modalidade === 'Pré Fixado') {
      taxaPreFixadoValue = parseFloat(taxaPreFixado.replace(',', '.'));
      if (isNaN(taxaPreFixadoValue)) {
        toast({
          title: "Taxa inválida",
          description: "A taxa pré-fixada deve ser um número válido",
          variant: "destructive"
        });
        return;
      }
    } else if (modalidade === 'Pós Fixado') {
      taxaPosCDIValue = parseFloat(taxaPosCDI.replace(',', '.'));
      if (isNaN(taxaPosCDIValue)) {
        toast({
          title: "Taxa inválida",
          description: "A taxa pós-CDI deve ser um número válido",
          variant: "destructive"
        });
        return;
      }
    } else if (modalidade === 'IPCA+') {
      taxaIPCAValue = parseFloat(taxaIPCA.replace(',', '.'));
      if (isNaN(taxaIPCAValue)) {
        toast({
          title: "Taxa inválida",
          description: "A taxa IPCA+ deve ser um número válido",
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      adicionarInvestimento({
        clienteId,
        tipoInvestimento,
        modalidade,
        titulo: titulo || '',
        valorAporte: valorAporteNumber,
        dataAporte,
        dataVencimento,
        ipcaAtual: ipcaAtualValue,
        selicAtual: selicAtualValue,
        taxaPreFixado: taxaPreFixadoValue,
        taxaPosCDI: taxaPosCDIValue,
        taxaIPCA: taxaIPCAValue,
      });
      
      // Limpa o formulário
      setValorAporte('');
      setDataAporte('');
      setDataVencimento('');
      setTaxaPreFixado('');
      setTaxaPosCDI('');
      setTaxaIPCA('');
      setTitulo('');
      setIpcaAtual('');
      setSelicAtual('');
    } catch (error) {
      console.error("Erro ao adicionar investimento:", error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao processar o investimento. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleValorAporteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorAporte(currencyInputMask(e.target.value));
  };
  
  const handleDataAporteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataAporte(dateInputMask(e.target.value));
  };
  
  const handleDataVencimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataVencimento(dateInputMask(e.target.value));
  };
  
  const handleIpcaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpcaAtual(percentageInputMask(e.target.value));
  };
  
  const handleSelicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelicAtual(percentageInputMask(e.target.value));
  };
  
  const handleTaxaPreFixadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxaPreFixado(percentageInputMask(e.target.value));
  };
  
  const handleTaxaPosCDIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxaPosCDI(percentageInputMask(e.target.value));
  };
  
  const handleTaxaIPCAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxaIPCA(percentageInputMask(e.target.value));
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Seleção de Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select value={clienteId} onValueChange={setClienteId} required>
                <SelectTrigger id="cliente">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Investimento */}
            <div className="space-y-2">
              <Label htmlFor="tipoInvestimento">Tipo de Investimento</Label>
              <Select 
                value={tipoInvestimento} 
                onValueChange={(value) => setTipoInvestimento(value as TipoInvestimento)}
                required
              >
                <SelectTrigger id="tipoInvestimento">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDB">CDB</SelectItem>
                  <SelectItem value="LCI">LCI</SelectItem>
                  <SelectItem value="LCA">LCA</SelectItem>
                  <SelectItem value="LCD">LCD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Modalidade */}
            <div className="space-y-2">
              <Label htmlFor="modalidade">Modalidade</Label>
              <Select 
                value={modalidade} 
                onValueChange={(value) => setModalidade(value as Modalidade)}
                required
              >
                <SelectTrigger id="modalidade">
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pré Fixado">Pré Fixado</SelectItem>
                  <SelectItem value="Pós Fixado">Pós Fixado</SelectItem>
                  <SelectItem value="IPCA+">IPCA+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Título (novo campo após "Modalidade") */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Título do investimento"
                maxLength={50}
              />
            </div>

            {/* Valor do Aporte */}
            <div className="space-y-2">
              <Label htmlFor="valorAporte">Valor do Aporte</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <Input
                  id="valorAporte"
                  value={valorAporte}
                  onChange={handleValorAporteChange}
                  className="pl-9"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            {/* Data do Aporte */}
            <div className="space-y-2">
              <Label htmlFor="dataAporte">Data do Aporte</Label>
              <Input
                id="dataAporte"
                value={dataAporte}
                onChange={handleDataAporteChange}
                placeholder="DD/MM/AA"
                maxLength={8}
                required
              />
            </div>

            {/* Data do Vencimento */}
            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data do Vencimento</Label>
              <Input
                id="dataVencimento"
                value={dataVencimento}
                onChange={handleDataVencimentoChange}
                placeholder="DD/MM/AA"
                maxLength={8}
                required
              />
            </div>

            {/* IPCA Atual */}
            <div className="space-y-2">
              <Label htmlFor="ipcaAtual">IPCA Atual (%)</Label>
              <Input
                id="ipcaAtual"
                value={ipcaAtual}
                onChange={handleIpcaChange}
                placeholder="0,00"
                required
              />
            </div>

            {/* SELIC Atual */}
            <div className="space-y-2">
              <Label htmlFor="selicAtual">SELIC Atual (%)</Label>
              <Input
                id="selicAtual"
                value={selicAtual}
                onChange={handleSelicChange}
                placeholder="0,00"
                required
              />
            </div>

            {/* Taxa Pré-Fixado (visível apenas para modalidade Pré Fixado) */}
            {showTaxaPreFixado && (
              <div className="space-y-2">
                <Label htmlFor="taxaPreFixado">Taxa (% ao ano)</Label>
                <Input
                  id="taxaPreFixado"
                  value={taxaPreFixado}
                  onChange={handleTaxaPreFixadoChange}
                  placeholder="0,00"
                  required={showTaxaPreFixado}
                />
              </div>
            )}

            {/* Taxa Pós-CDI (visível apenas para modalidade Pós Fixado) */}
            {showTaxaPosCDI && (
              <div className="space-y-2">
                <Label htmlFor="taxaPosCDI">Taxa (% do CDI)</Label>
                <Input
                  id="taxaPosCDI"
                  value={taxaPosCDI}
                  onChange={handleTaxaPosCDIChange}
                  placeholder="0,00"
                  required={showTaxaPosCDI}
                />
              </div>
            )}

            {/* Taxa IPCA (visível apenas para modalidade IPCA+) */}
            {showTaxaIPCA && (
              <div className="space-y-2">
                <Label htmlFor="taxaIPCA">Taxa (% ao ano Pré-fixado)</Label>
                <Input
                  id="taxaIPCA"
                  value={taxaIPCA}
                  onChange={handleTaxaIPCAChange}
                  placeholder="0,00"
                  required={showTaxaIPCA}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-dourado hover:bg-dourado-dark">
              Cadastrar Investimento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestimentoForm;
