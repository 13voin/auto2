import React, { useState } from 'react';
import { X, Car, Gauge } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleSettingsProps {
  vehicle: Vehicle | null;
  onUpdateMileage: (vehicleId: string, newMileage: number) => void;
  onCancel: () => void;
}

export const VehicleSettings: React.FC<VehicleSettingsProps> = ({
  vehicle,
  onUpdateMileage,
  onCancel
}) => {
  const [newMileage, setNewMileage] = useState(vehicle?.currentMileage || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicle && newMileage >= vehicle.currentMileage) {
      onUpdateMileage(vehicle.id, newMileage);
    } else {
      alert('Новый пробег не может быть меньше текущего');
    }
  };

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Обновить пробег
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Начальный пробег:</span>
              <span className="font-medium">{vehicle.initialMileage.toLocaleString()} км</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Текущий пробег:</span>
              <span className="font-medium">{vehicle.currentMileage.toLocaleString()} км</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Пройдено:</span>
              <span className="font-medium text-blue-600">
                {(vehicle.currentMileage - vehicle.initialMileage).toLocaleString()} км
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Новый пробег (км)
            </label>
            <div className="relative">
              <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={newMileage}
                onChange={(e) => setNewMileage(parseInt(e.target.value) || 0)}
                required
                min={vehicle.currentMileage}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите новый пробег"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Минимальное значение: {vehicle.currentMileage.toLocaleString()} км
            </p>
          </div>

          {newMileage > vehicle.currentMileage && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                Будет добавлено: <span className="font-semibold">
                  {(newMileage - vehicle.currentMileage).toLocaleString()} км
                </span>
              </p>
            </div>
          )}

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
              Обновить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};