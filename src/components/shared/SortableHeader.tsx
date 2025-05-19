
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { SortDirection } from '@/hooks/useSortable';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortKey?: string;
  sortDirection?: SortDirection;
  onSort: (key: string) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  sortKey,
  currentSortKey,
  sortDirection,
  onSort,
  className = ''
}) => {
  const isActive = currentSortKey === sortKey;
  
  return (
    <TableHead 
      className={`cursor-pointer hover:bg-gray-50 ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {isActive && sortDirection === 'asc' && <ArrowUp size={14} />}
        {isActive && sortDirection === 'desc' && <ArrowDown size={14} />}
      </div>
    </TableHead>
  );
};

export default SortableHeader;
