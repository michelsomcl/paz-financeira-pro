import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, Upload, Table } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from '@/hooks/use-toast';
import { InvestimentoComCalculo } from '@/types';
import { useAppContext } from '@/contexts/AppContext';
import { exportarInvestimentosParaExcel, baixarTemplateExcel } from '@/utils/excel';
import { processarDadosImportacao } from '@/services/importacao';

interface InvestimentoExportProps {
  investimentos: InvestimentoComCalculo[];
  onImport?: (data: any[]) => void;
}

const InvestimentoExport: React.FC<InvestimentoExportProps> = ({ investimentos, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { adicionarInvestimento, clientes } = useAppContext();

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          toast({
            title: "Erro na importação",
            description: "O arquivo não contém dados para importar.",
            variant: "destructive"
          });
          return;
        }

        processarDadosImportacao(jsonData, clientes, adicionarInvestimento);
        
        if (onImport) {
          onImport(jsonData);
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Erro ao importar arquivo:', error);
        toast({
          title: "Erro na importação",
          description: "Ocorreu um erro ao importar o arquivo. Verifique se o formato está correto.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-dourado hover:bg-dourado-dark">
            <Download className="mr-2" size={16} />
            Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => exportarInvestimentosParaExcel(investimentos)}>
            <FileSpreadsheet className="mr-2" size={16} />
            Exportar Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button className="bg-dourado hover:bg-dourado-dark" onClick={() => fileInputRef.current?.click()}>
        <Upload className="mr-2" size={16} />
        Importar Excel
      </Button>
      
      <Button variant="secondary" onClick={baixarTemplateExcel}>
        <Table className="mr-2" size={16} />
        Template
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".xlsx,.xls"
        className="hidden"
      />
    </div>
  );
};

export default InvestimentoExport;
