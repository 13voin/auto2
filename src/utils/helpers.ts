import { CarPart } from '../types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount);
};

export const getPartStatus = (part: CarPart, currentMileage: number): 'good' | 'warning' | 'critical' => {
  const mileageDiff = currentMileage - part.mileageAtInstall;
  const progress = mileageDiff / part.recommendedMileage;
  
  if (progress >= 1) return 'critical';
  if (progress >= 0.8) return 'warning';
  return 'good';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'good': return 'bg-green-100 text-green-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'critical': return 'bg-red-100 text-red-800';
    case 'replaced': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'good': return 'Хорошее';
    case 'warning': return 'Требует внимания';
    case 'critical': return 'Требует замены';
    case 'replaced': return 'Заменено';
    default: return 'Неизвестно';
  }
};