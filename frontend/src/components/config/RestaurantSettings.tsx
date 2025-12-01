// Restaurant Settings Component
import React, { useState, useEffect } from 'react';
import { Settings, Clock, CreditCard, MessageSquare, Save, Edit2, X } from 'lucide-react';
import { ConfigService } from '../../services/configService';
import type { RestaurantConfig } from '../../types/api';

interface RestaurantSettingsProps {
  className?: string;
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TONE_OPTIONS = ['friendly', 'formal', 'casual'];

export const RestaurantSettings: React.FC<RestaurantSettingsProps> = ({ className = '' }) => {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState<RestaurantConfig | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await ConfigService.getRestaurantConfig();
      if (response.success && response.data) {
        setConfig(response.data);
        setEditedConfig(response.data);
      } else {
        setError(response.error || 'Failed to load configuration');
      }
    } catch (err) {
      setError('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedConfig) return;
    
    try {
      setSaving(true);
      const response = await ConfigService.updateRestaurantConfig(editedConfig);
      if (response.success && response.data) {
        setConfig(response.data);
        setEditing(false);
      } else {
        setError(response.error || 'Failed to save configuration');
      }
    } catch (err) {
      setError('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedConfig(config);
    setEditing(false);
  };

  const updateBusinessHours = (day: string, field: 'open' | 'close' | 'isOpen', value: string | boolean) => {
    if (!editedConfig) return;
    
    setEditedConfig({
      ...editedConfig,
      settings: {
        ...editedConfig.settings,
        businessHours: {
          ...editedConfig.settings.businessHours,
          [day]: {
            ...editedConfig.settings.businessHours[day],
            [field]: value
          }
        }
      }
    });
  };

  const updateBranding = (field: 'tone' | 'welcomeMessage', value: string) => {
    if (!editedConfig) return;
    
    setEditedConfig({
      ...editedConfig,
      branding: {
        ...editedConfig.branding,
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-sm ${className}`}>
        <div className="text-red-600 text-center">{error}</div>
        <button onClick={loadConfig} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mx-auto block">
          Retry
        </button>
      </div>
    );
  }

  const displayConfig = editing ? editedConfig : config;

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Restaurant Settings</h2>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Restaurant Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
          {editing ? (
            <input
              type="text"
              value={editedConfig?.name || ''}
              onChange={(e) => setEditedConfig(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-lg text-gray-900">{displayConfig?.name}</p>
          )}
        </div>

        {/* Business Hours */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
          </div>
          <div className="space-y-3">
            {DAYS_OF_WEEK.map(day => {
              const hours = displayConfig?.settings.businessHours[day];
              return (
                <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-28 capitalize font-medium text-gray-700">{day}</div>
                  {editing ? (
                    <>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hours?.isOpen ?? true}
                          onChange={(e) => updateBusinessHours(day, 'isOpen', e.target.checked)}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Open</span>
                      </label>
                      <input
                        type="time"
                        value={hours?.open || '09:00'}
                        onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                        disabled={!hours?.isOpen}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours?.close || '22:00'}
                        onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                        disabled={!hours?.isOpen}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </>
                  ) : (
                    <span className="text-gray-600">
                      {hours?.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Payment & Tax</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate</label>
              <p className="text-gray-900">{((displayConfig?.settings.taxRate || 0) * 100).toFixed(1)}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Methods</label>
              <div className="flex flex-wrap gap-2">
                {displayConfig?.settings.paymentMethods.map(method => (
                  <span key={method} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full capitalize">
                    {method.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">AI Branding</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conversation Tone</label>
              {editing ? (
                <select
                  value={editedConfig?.branding.tone || 'friendly'}
                  onChange={(e) => updateBranding('tone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {TONE_OPTIONS.map(tone => (
                    <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 capitalize">{displayConfig?.branding.tone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
              {editing ? (
                <textarea
                  value={editedConfig?.branding.welcomeMessage || ''}
                  onChange={(e) => updateBranding('welcomeMessage', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600 italic">&ldquo;{displayConfig?.branding.welcomeMessage}&rdquo;</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSettings;
