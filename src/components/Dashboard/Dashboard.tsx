import React from 'react';
import { AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { CarPart, MaintenanceRecord } from '../../types';
import { formatCurrency, getPartStatus } from '../../utils/helpers';

interface DashboardProps {
  parts: CarPart[];
  records: MaintenanceRecord[];
  currentMileage: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ parts, records, currentMileage }) => {
  const totalParts = parts.length;
  const criticalParts = parts.filter(part => getPartStatus(part, currentMileage) === 'critical').length;
  const warningParts = parts.filter(part => getPartStatus(part, currentMileage) === 'warning').length;
  const goodParts = parts.filter(part => getPartStatus(part, currentMileage) === 'good').length;
  
  const totalSpent = records.reduce((sum, record) => sum + record.cost, 0);
  const thisMonthRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
  });

  const stats = [
    {
      title: 'Критические',
      value: criticalParts,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      title: 'Требуют внимания',
      value: warningParts,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'В норме',
      value: goodParts,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Потрачено',
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {thisMonthRecords.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Записи за этот месяц</h3>
          <div className="space-y-3">
            {thisMonthRecords.slice(0, 5).map(record => (
              <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{record.partName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString('ru-RU')} • {record.mileage.toLocaleString()} км
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(record.cost)}</p>
                  <p className="text-sm text-gray-500 capitalize">{record.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};