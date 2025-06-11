import { CarPart, MaintenanceRecord, Vehicle, PartTemplate } from '../types';

const PARTS_KEY = 'car-parts';
const RECORDS_KEY = 'maintenance-records';
const VEHICLES_KEY = 'vehicles';
const SELECTED_VEHICLE_KEY = 'selected-vehicle';
const PART_TEMPLATES_KEY = 'part-templates';

export const saveCarParts = (parts: CarPart[]): void => {
  localStorage.setItem(PARTS_KEY, JSON.stringify(parts));
};

export const loadCarParts = (): CarPart[] => {
  const stored = localStorage.getItem(PARTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveMaintenanceRecords = (records: MaintenanceRecord[]): void => {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};

export const loadMaintenanceRecords = (): MaintenanceRecord[] => {
  const stored = localStorage.getItem(RECORDS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveVehicles = (vehicles: Vehicle[]): void => {
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
};

export const loadVehicles = (): Vehicle[] => {
  const stored = localStorage.getItem(VEHICLES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveSelectedVehicle = (vehicleId: string): void => {
  localStorage.setItem(SELECTED_VEHICLE_KEY, vehicleId);
};

export const loadSelectedVehicle = (): string | null => {
  return localStorage.getItem(SELECTED_VEHICLE_KEY);
};

// Default part templates
const defaultPartTemplates: PartTemplate[] = [
  { id: '1', name: "Антифриз", interval: 60000, category: 'Cooling', isUserAdded: false },
  { id: '2', name: "Воздушный фильтр", interval: 40000, category: 'Engine', isUserAdded: false },
  { id: '3', name: "Жидкость ГУР", interval: 120000, category: 'Other', isUserAdded: false },
  { id: '4', name: "Масло редуктора", interval: 75000, category: 'Transmission', isUserAdded: false },
  { id: '5', name: "Масляный фильтр", interval: 8000, category: 'Engine', isUserAdded: false },
  { id: '6', name: "Моторное масло", interval: 8000, category: 'Engine', isUserAdded: false },
  { id: '7', name: "Ремень ГРМ", interval: 100000, category: 'Engine', isUserAdded: false },
  { id: '8', name: "Ремень генератора", interval: 100000, category: 'Engine', isUserAdded: false },
  { id: '9', name: "Свечи", interval: 30000, category: 'Engine', isUserAdded: false },
  { id: '10', name: "Топливный фильтр", interval: 25000, category: 'Fuel System', isUserAdded: false },
  { id: '11', name: "Тормозная жидкость", interval: 57000, category: 'Brakes', isUserAdded: false },
  { id: '12', name: "Тормозные барабаны", interval: 15000, category: 'Brakes', isUserAdded: false },
  { id: '13', name: "Тормозные диски", interval: 30000, category: 'Brakes', isUserAdded: false },
  { id: '14', name: "Тормозные колодки перед.", interval: 15000, category: 'Brakes', isUserAdded: false },
  { id: '15', name: "Тормозные колодки зад.", interval: 15000, category: 'Brakes', isUserAdded: false },
  { id: '16', name: "Масло АКПП", interval: 80000, category: 'Transmission', isUserAdded: false },
  { id: '17', name: "Масло МКПП", interval: 100000, category: 'Transmission', isUserAdded: false }
];

export const savePartTemplates = (templates: PartTemplate[]): void => {
  localStorage.setItem(PART_TEMPLATES_KEY, JSON.stringify(templates));
};

export const loadPartTemplates = (): PartTemplate[] => {
  const stored = localStorage.getItem(PART_TEMPLATES_KEY);
  if (!stored) {
    // Initialize with default templates
    savePartTemplates(defaultPartTemplates);
    return defaultPartTemplates;
  }
  return JSON.parse(stored);
};

// Legacy support - remove after migration
export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  currentMileage: number;
  vin?: string;
}

export const saveVehicleInfo = (info: VehicleInfo): void => {
  // Convert legacy format to new vehicle format
  const vehicles = loadVehicles();
  const newVehicle: Vehicle = {
    id: Date.now().toString(),
    make: info.make,
    model: info.model,
    year: info.year,
    initialMileage: 0,
    currentMileage: info.currentMileage,
    vin: info.vin,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackedParts: []
  };
  
  const updatedVehicles = [...vehicles, newVehicle];
  saveVehicles(updatedVehicles);
  saveSelectedVehicle(newVehicle.id);
};

export const loadVehicleInfo = (): VehicleInfo | null => {
  const vehicles = loadVehicles();
  const selectedVehicleId = loadSelectedVehicle();
  
  if (vehicles.length === 0) return null;
  
  const selectedVehicle = selectedVehicleId 
    ? vehicles.find(v => v.id === selectedVehicleId) 
    : vehicles[0];
    
  if (!selectedVehicle) return null;
  
  return {
    make: selectedVehicle.make,
    model: selectedVehicle.model,
    year: selectedVehicle.year,
    currentMileage: selectedVehicle.currentMileage,
    vin: selectedVehicle.vin
  };
};