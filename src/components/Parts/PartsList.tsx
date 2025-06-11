import React, { useState } from 'react';
import { CarPart, PartCategory } from '../../types';
import { PartCard } from './PartCard';
import { Filter } from 'lucide-react';

interface PartsListProps {
  parts: CarPart[];
  currentMileage: number;
  onEditPart: (part: CarPart) => void;
  onDeletePart: (partId: string) => void;
  searchQuery: string;
}

const categories: PartCategory[] = [
  'Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical', 
  'Cooling', 'Fuel System', 'Exhaust', 'Tires', 'Other'
];

export const PartsList: React.FC<PartsListProps> = ({
  parts,
  currentMileage,
  onEditPart,
  onDeletePart,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         part.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         part.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
    
    const matchesStatus = statusFilter === 'all' || part.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as PartCategory | 'All')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">Все категории</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Все статусы</option>
          <option value="good">Хорошее</option>
          <option value="warning">Требует внимания</option>
          <option value="critical">Требует замены</option>
          <option value="replaced">Заменено</option>
        </select>
      </div>

      {filteredParts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Детали не найдены</p>
          <p className="text-gray-400 text-sm mt-2">
            Попробуйте изменить фильтры или добавить новую деталь
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map(part => (
            <PartCard
              key={part.id}
              part={part}
              currentMileage={currentMileage}
              onEdit={onEditPart}
              onDelete={onDeletePart}
            />
          ))}
        </div>
      )}
    </div>
  );
};