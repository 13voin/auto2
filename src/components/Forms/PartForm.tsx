import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CarPart, PartCategory } from '../../types';

interface PartFormProps {
  part?: CarPart;
  onSave: (part: Omit<CarPart, 'id'>) => void;
  onCancel: () => void;
  currentMileage: number;
}

const categories: PartCategory[] = [
  'Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical',
  'Cooling', 'Fuel System', 'Exhaust', 'Tires', 'Other'
];

export const PartForm: React.FC<PartFormProps> = ({ part, onSave, onCancel, currentMileage }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Engine' as PartCategory,
    brand: '',
    partNumber: '',
    installDate: new Date().toISOString().split('T')[0],
    mileageAtInstall: currentMileage,
    recommendedMileage: 10000,
    cost: 0,
    notes: '',
    status: 'good' as const
  });

  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name,
        category: part.category as PartCategory,
        brand: part.brand,
        partNumber: part.partNumber,
        installDate: part.installDate.split('T')[0],
        mileageAtInstall: part.mileageAtInstall,
        recommendedMileage: part.recommendedMileage,
        cost: part.cost,
        notes: part.notes || '',
        status: part.status
      });
    }
  }, [part]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      lastReplaced: part?.lastReplaced
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mileageAtInstall' || name === 'recommendedMileage' || name === 'cost' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {part ? 'Редактировать деталь' : 'Добавить деталь'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название детали
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Например: Масляный фильтр"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Бренд
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Например: Bosch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Артикул
              </label>
              <input
                type="text"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Номер детали"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата установки
              </label>
              <input
                type="date"
                name="installDate"
                value={formData.installDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пробег при установке (км)
              </label>
              <input
                type="number"
                name="mileageAtInstall"
                value={formData.mileageAtInstall}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Рекомендуемый интервал замены (км)
              </label>
              <input
                type="number"
                name="recommendedMileage"
                value={formData.recommendedMileage}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Стоимость (₽)
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Заметки
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Дополнительная информация..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {part ? 'Обновить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};