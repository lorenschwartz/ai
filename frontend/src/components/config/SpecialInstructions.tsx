// Special Instructions Component
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, X, Save, Eye, EyeOff, Bot } from 'lucide-react';
import { ConfigService } from '../../services/configService';
import type { SpecialInstruction, CreateSpecialInstructionRequest, InstructionType, InstructionPriority } from '../../types/api';

interface SpecialInstructionsProps {
  className?: string;
}

const PRIORITY_COLORS: Record<InstructionPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const TYPE_ICONS: Record<InstructionType, string> = {
  kitchen: '👨‍🍳',
  service: '🍽️',
  dietary: '🥗',
  promotional: '🎉',
  general: '📋'
};

const TYPE_OPTIONS: InstructionType[] = ['kitchen', 'service', 'dietary', 'promotional', 'general'];
const PRIORITY_OPTIONS: InstructionPriority[] = ['low', 'medium', 'high', 'critical'];

export const SpecialInstructions: React.FC<SpecialInstructionsProps> = ({ className = '' }) => {
  const [instructions, setInstructions] = useState<SpecialInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<SpecialInstruction | null>(null);
  const [formData, setFormData] = useState<CreateSpecialInstructionRequest>({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium',
    isActive: true,
    showToAI: true,
    createdBy: ''
  });
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<InstructionType | 'all'>('all');

  useEffect(() => {
    loadInstructions();
  }, []);

  const loadInstructions = async () => {
    try {
      setLoading(true);
      const response = await ConfigService.getInstructions();
      if (response.success && response.data) {
        setInstructions(response.data.data);
      } else {
        setError(response.error || 'Failed to load instructions');
      }
    } catch (err) {
      setError('Failed to load instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingInstruction) {
        const response = await ConfigService.updateInstruction(editingInstruction.id, formData);
        if (response.success) {
          loadInstructions();
          resetForm();
        } else {
          setError(response.error || 'Failed to update instruction');
        }
      } else {
        const response = await ConfigService.createInstruction(formData);
        if (response.success) {
          loadInstructions();
          resetForm();
        } else {
          setError(response.error || 'Failed to create instruction');
        }
      }
    } catch (err) {
      setError('Failed to save instruction');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this instruction?')) return;
    
    try {
      const response = await ConfigService.deleteInstruction(id);
      if (response.success) {
        loadInstructions();
      } else {
        setError(response.error || 'Failed to delete instruction');
      }
    } catch (err) {
      setError('Failed to delete instruction');
    }
  };

  const handleEdit = (instruction: SpecialInstruction) => {
    setEditingInstruction(instruction);
    setFormData({
      title: instruction.title,
      content: instruction.content,
      type: instruction.type,
      priority: instruction.priority,
      isActive: instruction.isActive,
      showToAI: instruction.showToAI,
      createdBy: instruction.createdBy || ''
    });
    setShowForm(true);
  };

  const handleToggleActive = async (instruction: SpecialInstruction) => {
    try {
      const response = await ConfigService.updateInstruction(instruction.id, {
        isActive: !instruction.isActive
      });
      if (response.success) {
        loadInstructions();
      }
    } catch (err) {
      setError('Failed to update instruction');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingInstruction(null);
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium',
      isActive: true,
      showToAI: true,
      createdBy: ''
    });
    setError(null);
  };

  const filteredInstructions = filterType === 'all' 
    ? instructions 
    : instructions.filter(i => i.type === filterType);

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
            <FileText className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Special Instructions</h2>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Instruction
          </button>
        </div>
        <p className="text-gray-500 mt-2">
          Chef and owner notes that guide AI recommendations and service
        </p>
      </div>

      {error && (
        <div className="m-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-800 underline">Dismiss</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-6 pt-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({instructions.length})
        </button>
        {TYPE_OPTIONS.map(type => {
          const count = instructions.filter(i => i.type === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                filterType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{TYPE_ICONS[type]}</span>
              <span className="capitalize">{type}</span>
              <span>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="p-6 bg-gray-50 border-b border-gray-200 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingInstruction ? 'Edit Instruction' : 'Add New Instruction'}
              </h3>
              <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief instruction title"
                required
                maxLength={100}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Detailed instruction for staff and/or AI..."
                required
                maxLength={2000}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.content.length}/2000 characters</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as InstructionType })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {TYPE_OPTIONS.map(type => (
                    <option key={type} value={type}>
                      {TYPE_ICONS[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as InstructionPriority })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {PRIORITY_OPTIONS.map(priority => (
                    <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  placeholder="e.g., Chef Wang"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.showToAI}
                  onChange={(e) => setFormData({ ...formData, showToAI: e.target.checked })}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show to AI assistant</span>
              </label>
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
                {saving ? 'Saving...' : (editingInstruction ? 'Update' : 'Add Instruction')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Instructions List */}
      <div className="p-6">
        {filteredInstructions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No instructions found.</p>
            <p className="text-sm">Add instructions to guide your AI assistant and staff.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInstructions.map(instruction => (
              <div
                key={instruction.id}
                className={`p-4 border rounded-lg ${instruction.isActive ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{TYPE_ICONS[instruction.type]}</span>
                      <h4 className="text-lg font-semibold text-gray-900">{instruction.title}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${PRIORITY_COLORS[instruction.priority]}`}>
                        {instruction.priority}
                      </span>
                      {instruction.showToAI && (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                          <Bot className="h-3 w-3" />
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{instruction.content}</p>
                    {instruction.createdBy && (
                      <p className="text-xs text-gray-400 mt-2">— {instruction.createdBy}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleToggleActive(instruction)}
                      className={`p-1 transition-colors ${instruction.isActive ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                      title={instruction.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {instruction.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(instruction)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit instruction"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(instruction.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete instruction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Instructions Preview */}
      {instructions.some(i => i.showToAI && i.isActive) && (
        <div className="p-6 bg-purple-50 border-t border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-medium text-purple-900">AI Context Preview</h3>
          </div>
          <p className="text-xs text-purple-700">
            {instructions.filter(i => i.showToAI && i.isActive).length} instruction(s) will be provided to the AI assistant to improve recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpecialInstructions;
