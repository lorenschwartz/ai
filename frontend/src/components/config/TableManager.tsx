// Table Manager Component
import React, { useState, useEffect } from 'react';
import { Table2, Plus, Edit2, Trash2, X, Save, Users, MapPin } from 'lucide-react';
import { ConfigService } from '../../services/configService';
import type { Table, CreateTableRequest, TableStatus } from '../../types/api';

interface TableManagerProps {
  className?: string;
}

const STATUS_COLORS: Record<TableStatus, string> = {
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-red-100 text-red-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  unavailable: 'bg-gray-100 text-gray-800'
};

const STATUS_OPTIONS: TableStatus[] = ['available', 'occupied', 'reserved', 'unavailable'];

export const TableManager: React.FC<TableManagerProps> = ({ className = '' }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<CreateTableRequest>({
    tableNumber: '',
    capacity: 2,
    location: '',
    status: 'available',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await ConfigService.getTables();
      if (response.success && response.data) {
        // API returns data directly as array in the response
        setTables(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.error || 'Failed to load tables');
      }
    } catch (err) {
      setError('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingTable) {
        const response = await ConfigService.updateTable(editingTable.id, formData);
        if (response.success) {
          loadTables();
          resetForm();
        } else {
          setError(response.error || 'Failed to update table');
        }
      } else {
        const response = await ConfigService.createTable(formData);
        if (response.success) {
          loadTables();
          resetForm();
        } else {
          setError(response.error || 'Failed to create table');
        }
      }
    } catch (err) {
      setError('Failed to save table');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    
    try {
      const response = await ConfigService.deleteTable(id);
      if (response.success) {
        loadTables();
      } else {
        setError(response.error || 'Failed to delete table');
      }
    } catch (err) {
      setError('Failed to delete table');
    }
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location || '',
      status: table.status,
      isActive: table.isActive
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTable(null);
    setFormData({
      tableNumber: '',
      capacity: 2,
      location: '',
      status: 'available',
      isActive: true
    });
    setError(null);
  };

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table2 className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Tables & Seating</h2>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Table
          </button>
        </div>
        <p className="text-gray-500 mt-2">
          Manage your restaurant&apos;s tables and seating capacity
        </p>
      </div>

      {error && (
        <div className="m-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-800 underline">Dismiss</button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </h3>
              <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                <input
                  type="text"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  placeholder="e.g., T1, Booth 3"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  min={1}
                  max={50}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., By window, Patio"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TableStatus })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active (visible to staff and customers)</label>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : (editingTable ? 'Update Table' : 'Add Table')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tables Grid */}
      <div className="p-6">
        {tables.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Table2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No tables configured yet.</p>
            <p className="text-sm">Click &ldquo;Add Table&rdquo; to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map(table => (
              <div
                key={table.id}
                className={`p-4 border rounded-lg ${table.isActive ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{table.tableNumber}</h4>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${STATUS_COLORS[table.status]}`}>
                      {table.status}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(table)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit table"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete table"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Seats {table.capacity}</span>
                  </div>
                  {table.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{table.location}</span>
                    </div>
                  )}
                </div>
                
                {!table.isActive && (
                  <div className="mt-3 text-xs text-gray-400 italic">Inactive</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {tables.length > 0 && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-8 text-sm text-gray-600">
            <span>
              <strong className="text-gray-900">{tables.length}</strong> Total Tables
            </span>
            <span>
              <strong className="text-gray-900">{tables.reduce((sum, t) => sum + t.capacity, 0)}</strong> Total Capacity
            </span>
            <span>
              <strong className="text-green-600">{tables.filter(t => t.status === 'available').length}</strong> Available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;
