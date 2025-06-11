import React, { useState } from 'react';
import { X, Car, CheckCircle, Circle } from 'lucide-react';
import { Vehicle, PartTemplate } from '../../types';

interface VehiclePartsSelectorProps {
  vehicle: Vehicle;
  templates: PartTemplate[];
  onSave: (vehicleId: string, trackedPartIds: string[]) => void;
  onCancel: () => void;
}

export const VehiclePartsSelector: React.FC<VehiclePartsSelectorProps> = ({
  vehicle,
  templates,
  onSave,
  onCancel
}) => {
  const [selectedParts, setSelectedParts] = useState<Set<string>>(
    new Set(vehicle.trackedParts)
  );

  const togglePart = (partId: string) => {
    const newSelected = new Set(selectedParts);
    if (newSelected.has(partId)) {
      newSelected.delete(partId);
    } else {
      newSelected.add(partId);
    }
    setSelectedParts(newSelected);
  };

  const handleSave = () => {
    onSave(vehicle.id, Array.from(selectedParts));
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, PartTemplate[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Отслеживаемые детали
              </h2>
              <p className="text-sm text-gray-500">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Выберите детали, которые вы хотите отслеживать для этого автомобиля. 
            Система будет напоминать о необходимости замены на основе пробега.
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => togglePart(template.id)}
                    className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {selectedParts.has(template.id) ? (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{template.name}</p>
                            <p className="text-sm text-gray-500">
                              Интервал: {template.interval.toLocaleString()} км
                            </p>
                          </div>
                        </div>
                      </div>
                      {template.isUserAdded && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Пользовательская
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
          <div className="text-sm text-gray-600">
            Выбрано деталей: {selectedParts.size} из {templates.length}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Сохранить выбор
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};