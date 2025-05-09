
import { useState } from 'react';
import { parseDateString } from '@/utils/formatters';

export type SortField = string | null;
export type SortDirection = 'asc' | 'desc' | null;

export interface SortableOptions {
  initialSortField?: SortField;
  initialSortDirection?: SortDirection;
}

export function useSortable<T>(options: SortableOptions = {}) {
  const [sortField, setSortField] = useState<SortField>(options.initialSortField || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(options.initialSortDirection || null);

  const handleSort = (field: string) => {
    // If clicking the same field, toggle sort direction or reset
    if (field === sortField) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        // Reset sorting
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      // New field selected, start with ascending sort
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortData = <T extends Record<string, any>>(data: T[]): T[] => {
    if (!sortField || !sortDirection || data.length === 0) return data;
    
    return [...data].sort((a, b) => {
      // Helper function to safely get comparable values
      const getValue = (obj: any, path: string) => {
        const parts = path.split('.');
        let value = obj;
        
        for (const part of parts) {
          if (value === null || value === undefined) return '';
          value = value[part];
        }
        
        return value;
      };
      
      let valueA = getValue(a, sortField);
      let valueB = getValue(b, sortField);
      
      // Special handling for date fields (DD/MM/YY or DD/MM/YYYY format)
      if (sortField.includes('data') || sortField.includes('inicio') || sortField.includes('vencimento')) {
        const dateA = parseDateString(valueA);
        const dateB = parseDateString(valueB);
        
        if (dateA && dateB) {
          return sortDirection === 'asc' 
            ? dateA.getTime() - dateB.getTime() 
            : dateB.getTime() - dateA.getTime();
        }
      }
      
      // Handle numeric values
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      // Handle string values that might be numbers
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Try to parse as numbers for currency values
        const numA = parseFloat(valueA.replace(/[^0-9,-]/g, '').replace(',', '.'));
        const numB = parseFloat(valueB.replace(/[^0-9,-]/g, '').replace(',', '.'));
        
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === 'asc' ? numA - numB : numB - numA;
        }
        
        // Case-insensitive string comparison
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB, 'pt-BR') 
          : valueB.localeCompare(valueA, 'pt-BR');
      }
      
      // Fallback comparison
      if (valueA === valueB) return 0;
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      return sortDirection === 'asc' ? 1 : -1;
    });
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    sortData
  };
}
