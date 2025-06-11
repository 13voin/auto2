import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { PartsList } from './components/Parts/PartsList';
import { PartForm } from './components/Forms/PartForm';
import { VehicleSettings } from './components/Settings/VehicleSettings';
import { GarageView } from './components/Garage/GarageView';
import { VehicleForm } from './components/Forms/VehicleForm';
import { PartsDatabase } from './components/Parts/PartsDatabase';
import { VehiclePartsSelector } from './components/Parts/VehiclePartsSelector';
import { CarPart, MaintenanceRecord, Vehicle, PartTemplate } from './types';
import { 
  saveCarParts, 
  loadCarParts, 
  saveMaintenanceRecords, 
  loadMaintenanceRecords,
  saveVehicles,
  loadVehicles,
  saveSelectedVehicle,
  loadSelectedVehicle,
  savePartTemplates,
  loadPartTemplates
} from './utils/storage';

function App() {
  const [parts, setParts] = useState<CarPart[]>([]);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [templates, setTemplates] = useState<PartTemplate[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPartForm, setShowPartForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGarage, setShowGarage] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showPartsDatabase, setShowPartsDatabase] = useState(false);
  const [showPartsSelector, setShowPartsSelector] = useState(false);
  const [editingPart, setEditingPart] = useState<CarPart | undefined>();
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  const [configuringVehicle, setConfiguringVehicle] = useState<Vehicle | undefined>();

  useEffect(() => {
    const loadedVehicles = loadVehicles();
    const loadedSelectedVehicleId = loadSelectedVehicle();
    const loadedTemplates = loadPartTemplates();
    
    setVehicles(loadedVehicles);
    setParts(loadCarParts());
    setRecords(loadMaintenanceRecords());
    setTemplates(loadedTemplates);
    
    if (loadedVehicles.length > 0) {
      const vehicleToSelect = loadedSelectedVehicleId && loadedVehicles.find(v => v.id === loadedSelectedVehicleId)
        ? loadedSelectedVehicleId
        : loadedVehicles[0].id;
      setSelectedVehicleId(vehicleToSelect);
      saveSelectedVehicle(vehicleToSelect);
    } else {
      setShowGarage(true);
    }
  }, []);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || null;
  const currentMileage = selectedVehicle?.currentMileage || 0;

  // Create parts from templates when vehicle parts are configured
  const createPartsFromTemplates = (vehicleId: string, templateIds: string[]) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const existingParts = parts.filter(p => p.vehicleId === vehicleId);
    const newParts: CarPart[] = [];

    templateIds.forEach(templateId => {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      // Check if part already exists for this vehicle
      const existingPart = existingParts.find(p => 
        p.name === template.name && p.vehicleId === vehicleId
      );

      if (!existingPart) {
        const newPart: CarPart = {
          id: `${vehicleId}-${templateId}-${Date.now()}`,
          vehicleId: vehicleId,
          name: template.name,
          category: template.category,
          brand: 'Не указан',
          partNumber: '',
          installDate: new Date().toISOString(),
          mileageAtInstall: vehicle.currentMileage,
          recommendedMileage: template.interval,
          status: 'good',
          cost: 0,
          notes: `Автоматически создано из шаблона`
        };
        newParts.push(newPart);
      }
    });

    if (newParts.length > 0) {
      const updatedParts = [...parts, ...newParts];
      setParts(updatedParts);
      saveCarParts(updatedParts);
    }
  };

  const handleSavePart = (partData: Omit<CarPart, 'id'>) => {
    if (!selectedVehicleId) return;

    if (editingPart) {
      const updatedParts = parts.map(part =>
        part.id === editingPart.id ? { ...partData, id: editingPart.id, vehicleId: selectedVehicleId } : part
      );
      setParts(updatedParts);
      saveCarParts(updatedParts);
    } else {
      const newPart: CarPart = {
        ...partData,
        id: Date.now().toString(),
        vehicleId: selectedVehicleId
      };
      const updatedParts = [...parts, newPart];
      setParts(updatedParts);
      saveCarParts(updatedParts);
    }
    setShowPartForm(false);
    setEditingPart(undefined);
  };

  const handleEditPart = (part: CarPart) => {
    setEditingPart(part);
    setShowPartForm(true);
  };

  const handleDeletePart = (partId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту деталь?')) {
      const updatedParts = parts.filter(part => part.id !== partId);
      setParts(updatedParts);
      saveCarParts(updatedParts);
    }
  };

  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingVehicle) {
      const updatedVehicle: Vehicle = {
        ...vehicleData,
        id: editingVehicle.id,
        createdAt: editingVehicle.createdAt,
        updatedAt: now
      };
      const updatedVehicles = vehicles.map(v => v.id === editingVehicle.id ? updatedVehicle : v);
      setVehicles(updatedVehicles);
      saveVehicles(updatedVehicles);
    } else {
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      const updatedVehicles = [...vehicles, newVehicle];
      setVehicles(updatedVehicles);
      saveVehicles(updatedVehicles);
      setSelectedVehicleId(newVehicle.id);
      saveSelectedVehicle(newVehicle.id);
    }
    
    setShowVehicleForm(false);
    setEditingVehicle(undefined);
    setShowGarage(false);
  };

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    saveSelectedVehicle(vehicleId);
    setShowGarage(false);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleForm(true);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
    const updatedParts = parts.filter(p => p.vehicleId !== vehicleId);
    const updatedRecords = records.filter(r => r.vehicleId !== vehicleId);
    
    setVehicles(updatedVehicles);
    setParts(updatedParts);
    setRecords(updatedRecords);
    
    saveVehicles(updatedVehicles);
    saveCarParts(updatedParts);
    saveMaintenanceRecords(updatedRecords);
    
    if (selectedVehicleId === vehicleId) {
      if (updatedVehicles.length > 0) {
        setSelectedVehicleId(updatedVehicles[0].id);
        saveSelectedVehicle(updatedVehicles[0].id);
      } else {
        setSelectedVehicleId(null);
        setShowGarage(true);
      }
    }
  };

  const handleUpdateMileage = (vehicleId: string, newMileage: number) => {
    const updatedVehicles = vehicles.map(v => 
      v.id === vehicleId 
        ? { ...v, currentMileage: newMileage, updatedAt: new Date().toISOString() }
        : v
    );
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
    setShowSettings(false);
  };

  const handleSavePartTemplates = (newTemplates: PartTemplate[]) => {
    setTemplates(newTemplates);
    savePartTemplates(newTemplates);
    setShowPartsDatabase(false);
  };

  const handleConfigureParts = (vehicle: Vehicle) => {
    setConfiguringVehicle(vehicle);
    setShowPartsSelector(true);
  };

  const handleSaveVehicleParts = (vehicleId: string, trackedPartIds: string[]) => {
    const updatedVehicles = vehicles.map(v =>
      v.id === vehicleId ? { ...v, trackedParts: trackedPartIds, updatedAt: new Date().toISOString() } : v
    );
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
    
    // Create parts from selected templates
    createPartsFromTemplates(vehicleId, trackedPartIds);
    
    setShowPartsSelector(false);
    setConfiguringVehicle(undefined);
  };

  // Filter parts for selected vehicle
  const vehicleParts = parts.filter(part => part.vehicleId === selectedVehicleId);
  const vehicleRecords = records.filter(record => record.vehicleId === selectedVehicleId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddPart={() => setShowPartForm(true)}
        onToggleSettings={() => setShowSettings(true)}
        onShowGarage={() => setShowGarage(true)}
        onManageDatabase={() => setShowPartsDatabase(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedVehicle={selectedVehicle}
        showGarage={showGarage}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showGarage ? (
          <GarageView
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            templates={templates}
            onSelectVehicle={handleSelectVehicle}
            onAddVehicle={() => setShowVehicleForm(true)}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onConfigureParts={handleConfigureParts}
            onManageDatabase={() => setShowPartsDatabase(true)}
          />
        ) : selectedVehicle ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                  </h2>
                  <div className="flex items-center space-x-6 text-gray-600">
                    <p>Текущий пробег: {selectedVehicle.currentMileage.toLocaleString()} км</p>
                    <p>Начальный пробег: {selectedVehicle.initialMileage.toLocaleString()} км</p>
                    <p>Пройдено: {(selectedVehicle.currentMileage - selectedVehicle.initialMileage).toLocaleString()} км</p>
                    <p>Отслеживается деталей: {selectedVehicle.trackedParts?.length || 0}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleConfigureParts(selectedVehicle)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
                  >
                    <span>Настроить детали</span>
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <span>Обновить пробег</span>
                  </button>
                </div>
              </div>
            </div>

            <Dashboard 
              parts={vehicleParts}
              records={vehicleRecords}
              currentMileage={currentMileage}
            />

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Детали</h2>
              <PartsList
                parts={vehicleParts}
                currentMileage={currentMileage}
                onEditPart={handleEditPart}
                onDeletePart={handleDeletePart}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Добро пожаловать в АвтоТрекер!
              </h2>
              <p className="text-gray-600 mb-6">
                Для начала работы добавьте свой первый автомобиль в гараж
              </p>
              <button
                onClick={() => setShowVehicleForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Добавить автомобиль
              </button>
            </div>
          </div>
        )}
      </main>

      {showPartForm && selectedVehicle && (
        <PartForm
          part={editingPart}
          onSave={handleSavePart}
          onCancel={() => {
            setShowPartForm(false);
            setEditingPart(undefined);
          }}
          currentMileage={currentMileage}
        />
      )}

      {showSettings && selectedVehicle && (
        <VehicleSettings
          vehicle={selectedVehicle}
          onUpdateMileage={handleUpdateMileage}
          onCancel={() => setShowSettings(false)}
        />
      )}

      {showVehicleForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
          onCancel={() => {
            setShowVehicleForm(false);
            setEditingVehicle(undefined);
          }}
        />
      )}

      {showPartsDatabase && (
        <PartsDatabase
          templates={templates}
          onSave={handleSavePartTemplates}
          onCancel={() => setShowPartsDatabase(false)}
        />
      )}

      {showPartsSelector && configuringVehicle && (
        <VehiclePartsSelector
          vehicle={configuringVehicle}
          templates={templates}
          onSave={handleSaveVehicleParts}
          onCancel={() => {
            setShowPartsSelector(false);
            setConfiguringVehicle(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;