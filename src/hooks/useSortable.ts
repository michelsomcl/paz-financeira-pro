
import { useState } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function useSortable<T>(initialData: T[], initialSortConfig: SortConfig | null = null) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSortConfig);
  const [data, setData] = useState<T[]>(initialData);

  const requestSort = (key: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      } else {
        direction = 'asc';
      }
    }

    const newSortConfig = direction === null ? null : { key, direction };
    setSortConfig(newSortConfig);

    // Aplicar ordenação
    if (direction === null) {
      // Restaurar a ordem original
      setData([...initialData]);
    } else {
      const sortedData = [...data].sort((a: any, b: any) => {
        // Navegar pela estrutura aninhada se a chave contiver pontos (ex: "calculo.diasCorridos")
        const keys = key.split('.');
        let aValue = a;
        let bValue = b;
        
        for (const k of keys) {
          aValue = aValue && typeof aValue === 'object' ? aValue[k] : null;
          bValue = bValue && typeof bValue === 'object' ? bValue[k] : null;
        }

        if (aValue === null || aValue === undefined) return direction === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return direction === 'asc' ? -1 : 1;

        // Se os valores são números
        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
          return direction === 'asc' 
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        }

        // Se são datas no formato DD/MM/YYYY
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (typeof aValue === 'string' && typeof bValue === 'string' &&
            dateRegex.test(aValue) && dateRegex.test(bValue)) {
          // Converter DD/MM/YYYY para YYYY-MM-DD para comparação correta
          const [dayA, monthA, yearA] = aValue.split('/');
          const [dayB, monthB, yearB] = bValue.split('/');
          
          // Criar objetos Date com valores UTC para evitar problemas de fuso horário
          const dateA = new Date(Date.UTC(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA)));
          const dateB = new Date(Date.UTC(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB)));
          
          return direction === 'asc' 
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        // Comparação padrão de strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Caso padrão
        return direction === 'asc'
          ? aValue > bValue ? 1 : -1
          : bValue > aValue ? 1 : -1;
      });
      setData(sortedData);
    }
  };

  const updateData = (newData: T[]) => {
    setData(newData);
    // Aplicar a ordenação atual se houver
    if (sortConfig) {
      requestSort(sortConfig.key);
    }
  };

  return { data, requestSort, sortConfig, updateData };
}
