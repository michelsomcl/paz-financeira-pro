
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
        const aValue = a[key];
        const bValue = b[key];

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
          const [dayA, monthA, yearA] = aValue.split('/').map(Number);
          const [dayB, monthB, yearB] = bValue.split('/').map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
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
