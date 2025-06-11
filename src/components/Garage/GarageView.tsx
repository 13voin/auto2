import React, { useState } from 'react';
import { Car, Plus, Edit, Trash2, MapPin, Calendar, Gauge, Settings, Database, Image } from 'lucide-react';
import { Vehicle, PartTemplate } from '../../types';
import { formatDate } from '../../utils/helpers';

interface GarageViewProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  templates: PartTemplate[];
  onSelectVehicle: (vehicleId: string) => void;
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onConfigureParts: (vehicle: Vehicle) => void;
  onManageDatabase: () => void;
}

export const GarageView: React.FC<GarageViewProps> = ({
  vehicles,
  selectedVehicleId,
  templates,
  onSelectVehicle,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onConfigureParts,
  onManageDatabase
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDeleteClick = (vehicleId: string) => {
    setShowDeleteConfirm(vehicleId);
  };

  const confirmDelete = (vehicleId: string) => {
    onDeleteVehicle(vehicleId);
    setShowDeleteConfirm(null);
  };

  const getMileageDifference = (vehicle: Vehicle) => {
    return vehicle.currentMileage - vehicle.initialMileage;
  };

  const getTrackedPartsCount = (vehicle: Vehicle) => {
    return vehicle.trackedParts?.length || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мой гараж</h1>
          <p className="text-gray-600 mt-1">Управляйте своими автомобилями и отслеживайте их состояние</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onManageDatabase}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Database className="w-4 h-4" />
            <span>База деталей</span>
          </button>
          <button
            onClick={onAddVehicle}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить автомобиль</span>
          </button>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ваш гараж пуст
            </h2>
            <p className="text-gray-600 mb-6">
              Добавьте свой первый автомобиль, чтобы начать отслеживать замену деталей
            </p>
            <button
              onClick={onAddVehicle}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Добавить автомобиль
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <div
              key={vehicle.id}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md overflow-hidden ${
                selectedVehicleId === vehicle.id 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => onSelectVehicle(vehicle.id)}
            >
              {/* Vehicle Photo */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {vehicle.photo ? (
                  <img
                    src={vehicle.photo}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Car className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Нет фото</p>
                    </div>
                  </div>
                )}
                
                {/* Action buttons overlay */}
                <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfigureParts(vehicle);
                    }}
                    className="p-2 bg-white bg-opacity-90 text-gray-700 hover:text-purple-600 rounded-lg backdrop-blur-sm transition-colors duration-200"
                    title="Настроить отслеживаемые детали"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditVehicle(vehicle);
                    }}
                    className="p-2 bg-white bg-opacity-90 text-gray-700 hover:text-blue-600 rounded-lg backdrop-blur-sm transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(vehicle.id);
                    }}
                    className="p-2 bg-white bg-opacity-90 text-gray-700 hover:text-red-600 rounded-lg backdrop-blur-sm transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Selected indicator */}
                {selectedVehicleId === vehicle.id && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      Выбран
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Info */}
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    selectedVehicleId === vehicle.id ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500">{vehicle.year} год</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Gauge className="w-4 h-4" />
                    <span>Текущий пробег: {vehicle.currentMileage.toLocaleString()} км</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Начальный пробег: {vehicle.initialMileage.toLocaleString()} км</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Добавлен: {formatDate(vehicle.createdAt)}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Settings className="w-4 h-4" />
                    <span>Отслеживается деталей: {getTrackedPartsCount(vehicle)}</span>
                  </div>

                  {vehicle.licensePlate && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Гос. номер</p>
                      <p className="font-mono font-semibold text-gray-900">{vehicle.licensePlate}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Пройдено:</span>
                      <span className="font-semibold text-gray-900">
                        {getMileageDifference(vehicle).toLocaleString()} км
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Удалить автомобиль?
            </h3>
            <p className="text-gray-600 mb-6">
              Это действие нельзя отменить. Все данные о деталях и записях обслуживания будут удалены.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};