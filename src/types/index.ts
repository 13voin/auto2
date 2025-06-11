export interface CarPart {
  id: string;
  vehicleId: string;
  name: string;
  category: string;
  brand: string;
  partNumber: string;
  installDate: string;
  lastReplaced?: string;
  mileageAtInstall: number;
  recommendedMileage: number;
  status: 'good' | 'warning' | 'critical' | 'replaced';
  cost: number;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  partId: string;
  partName: string;
  date: string;
  mileage: number;
  cost: number;
  mechanic?: string;
  notes?: string;
  type: 'replacement' | 'repair' | 'inspection';
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  initialMileage: number;
  currentMileage: number;
  vin?: string;
  color?: string;
  licensePlate?: string;
  photo?: string; // Base64 encoded image
  createdAt: string;
  updatedAt: string;
  trackedParts: string[]; // Array of part template IDs
}

export interface PartTemplate {
  id: string;
  name: string;
  interval: number;
  category: string;
  isUserAdded: boolean;
}

export type PartCategory = 
  | 'Engine'
  | 'Transmission'
  | 'Brakes'
  | 'Suspension'
  | 'Electrical'
  | 'Cooling'
  | 'Fuel System'
  | 'Exhaust'
  | 'Tires'
  | 'Other';