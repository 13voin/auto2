import React, { useState } from 'react';
import { X, Plus, Trash2, Database, Edit3 } from 'lucide-react';
import { PartTemplate, PartCategory } from '../../types';

interface PartsDatabaseProps {
  templates: PartTemplate[];
  onSave: (templates: PartTemplate[]) => void;
  onCancel: () => void;
}

const categories: PartCategory[] = [
  'Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical',
  'Cooling', 'Fuel System', 'Exhaust', 'Tires', 'Other'
];

export const PartsDatabase: React.FC<PartsDatabaseProps> = ({
  templates,
  onSave,
  onCancel
}) => {
  const [localTemplates, setLocalTemplates] = useState<PartTemplate[]>(templates);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PartTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    interval: 10000,
    category: 'Engine' as PartCategory
  });

  const handleAddTemplate = () => {
    if (!newTemplate.name.trim()) return;

    const template: PartTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name.trim(),
      interval: newTemplate.interval,
      category: newTemplate.category,
      isUserAdded: true
    };

    setLocalTemplates([...localTemplates, template]);
    setNewTemplate({ name: '', interval: 10000, category: 'Engine' });
    setShowAddForm(false);
  };

  const handleEditTemplate = (template: PartTemplate) => {
    if (!template.isUserAdded) return;
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      interval: template.interval,
      category: template.category as PartCategory
    });
    setShowAddForm(true);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !newTemplate.name.trim()) return;

    const updatedTemplates = localTemplates.map(t =>
      t.id === editingTemplate.id
        ? { ...t, name: newTemplate.name.trim(), interval: newTemplate.interval, category: newTemplate.category }
        : t
    );

    setLocalTemplates(updatedTemplates);
    setEditingTemplate(null);
    setNewTemplate({ name: '', interval: 10000, category: 'Engine' });
    setShowAddForm(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = localTemplates.find(t => t.id === templateId);
    if (!template?.isUserAdded) return;

    if (confirm(`Удалить деталь "${template.name}"?`)) {
      setLocalTemplates(localTemplates.filter(t => t.id !== templateId));
    }
  };

  const handleSave = () => {
    onSave(localTemplates);
  };

  const groupedTemplates = localTemplates.reduce((acc, template) => {
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
            <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              База деталей
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
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить деталь</span>
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingTemplate ? 'Редактировать деталь' : 'Добавить новую деталь'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название детали
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Например: Салонный фильтр"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Интервал замены (км)
                </label>
                <input
                  type="number"
                  value={newTemplate.interval}
                  onChange={(e) => setNewTemplate({ ...newTemplate, interval: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1000"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as PartCategory })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTemplate(null);
                  setNewTemplate({ name: '', interval: 10000, category: 'Engine' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                onClick={editingTemplate ? handleUpdateTemplate : handleAddTemplate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                {editingTemplate ? 'Обновить' : 'Добавить'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryTemplates.map(template => (
                  <div
                    key={template.id}
                    className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-sm text-gray-500">
                        {template.interval.toLocaleString()} км
                        {template.isUserAdded && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Пользовательская
                          </span>
                        )}
                      </p>
                    </div>
                    {template.isUserAdded && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};