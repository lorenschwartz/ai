// Configuration Studio Component - Main entry point
import React, { useState } from 'react';
import { Settings, Table2, FileText, UtensilsCrossed, Store } from 'lucide-react';
import { RestaurantSettings } from './RestaurantSettings';
import { TableManager } from './TableManager';
import { SpecialInstructions } from './SpecialInstructions';
import { MenuItemManager } from './MenuItemManager';

type Tab = 'restaurant' | 'menu' | 'tables' | 'instructions';

interface ConfigurationStudioProps {
  className?: string;
}

const TABS: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  { 
    id: 'restaurant', 
    label: 'Restaurant Settings', 
    icon: Store,
    description: 'Configure business hours, branding, and general settings'
  },
  { 
    id: 'menu', 
    label: 'Menu Items', 
    icon: UtensilsCrossed,
    description: 'Add, edit, and manage your menu items'
  },
  { 
    id: 'tables', 
    label: 'Tables & Seating', 
    icon: Table2,
    description: 'Configure tables and seating arrangements'
  },
  { 
    id: 'instructions', 
    label: 'Special Instructions', 
    icon: FileText,
    description: 'Chef and owner notes for AI recommendations'
  }
];

export const ConfigurationStudio: React.FC<ConfigurationStudioProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<Tab>('restaurant');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'restaurant':
        return <RestaurantSettings />;
      case 'menu':
        return <MenuItemManager />;
      case 'tables':
        return <TableManager />;
      case 'instructions':
        return <SpecialInstructions />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuration Studio</h1>
              <p className="text-gray-500">Onboard and configure your restaurant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Configuration tabs">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  title={tab.description}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-blue-700">
            {TABS.find(t => t.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ConfigurationStudio;
