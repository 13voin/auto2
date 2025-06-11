import React from 'react';
import { Car, Settings, Plus, Search, Gauge as Garage, Database } from 'lucide-react';
import { Vehicle } from '../../types';

interface HeaderProps {
  onAddPart: () => void;
  onToggleSettings: () => void;
  onShowGarage: () => void;
  onManageDatabase: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedVehicle: Vehicle | null;
  showGarage: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onAddPart, 
  onToggleSettings, 
  onShowGarage,
  onManageDatabase,
  searchQuery, 
  setSearchQuery,
  selectedVehicle,
  showGarage
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">АвтоТрекер</h1>
              <p className="text-sm text-gray-500">
                {selectedVehicle && !showGarage 
                  ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})`
                  : 'Контроль замены деталей'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!showGarage && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск деталей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <button
              onClick={onManageDatabase}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <Database className="w-4 h-4" />
              <span>База деталей</span>
            </button>
            
            <button
              onClick={onShowGarage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                showGarage 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Garage className="w-4 h-4" />
              <span>Гараж</span>
            </button>

            {!showGarage && selectedVehicle && (
              <button
                onClick={onAddPart}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить деталь</span>
              </button>
            )}

            <button
              onClick={onToggleSettings}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};