
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SortableHeaderProps {
  field: string;
  children: React.ReactNode;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (field: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  field,
  children,
  sortField,
  sortDirection,
  onSort,
}) => {
  // Helper function to render sort indicator
  const renderSortIndicator = () => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 inline" /> 
      : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <TableHead 
      className="cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {children}
        {renderSortIndicator()}
      </div>
    </TableHead>
  );
};

export default SortableHeader;
