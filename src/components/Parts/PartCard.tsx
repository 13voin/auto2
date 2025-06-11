import React from 'react';
import { Calendar, MapPin, AlertCircle, Edit, Trash2, Clock } from 'lucide-react';
import { CarPart } from '../../types';
import { formatDate, formatCurrency, getPartStatus, getStatusColor, getStatusText } from '../../utils/helpers';

interface PartCardProps {
  part: CarPart;
  currentMileage: number;
  onEdit: (part: CarPart) => void;
  onDelete: (partId: string) => void;
}

export const PartCard: React.FC<PartCardProps> = ({ part, currentMileage, onEdit, onDelete }) => {
  const status = getPartStatus(part, currentMileage);
  const mileageDiff = currentMileage - part.mileageAtInstall;
  const progress = Math.min((mileageDiff / part.recommendedMileage) * 100, 100);
  const remainingMileage = Math.max(part.recommendedMileage - mileageDiff, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{part.name}</h3>
          <p className="text-sm text-gray-500">{part.category} • {part.brand}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(part)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(part.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Установлено: {formatDate(part.installDate)}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Пробег при установке: {part.mileageAtInstall.toLocaleString()} км</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertCircle className="w-4 h-4" />
          <span>Интервал замены: {part.recommendedMileage.toLocaleString()} км</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {status === 'critical' 
              ? `Просрочено на ${(mileageDiff - part.recommendedMileage).toLocaleString()} км`
              : `Осталось: ${remainingMileage.toLocaleString()} км`
            }
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Прогресс использования</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                progress >= 100 ? 'bg-red-500' : 
                progress >= 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            Пройдено: {mileageDiff.toLocaleString()} км из {part.recommendedMileage.toLocaleString()} км
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Стоимость:</span>
            <span className="font-semibold text-gray-900">{formatCurrency(part.cost)}</span>
          </div>
          {part.partNumber && (
            <p className="text-xs text-gray-500 mt-1">Артикул: {part.partNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
};