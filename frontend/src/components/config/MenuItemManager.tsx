// Menu Item Manager Component
import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Edit2, Trash2, X, Save, DollarSign, Clock, Flame } from 'lucide-react';
import { MenuService } from '../../services/menuService';
import { ConfigService } from '../../services/configService';
import type { MenuItem, CreateMenuItemRequest } from '../../types/api';

interface MenuItemManagerProps {
  className?: string;
}

const MENU_CATEGORIES = [
  'appetizer', 'soup', 'chicken', 'beef', 'pork', 'seafood', 'vegetable',
  'noodle', 'fried-rice', 'rice-platter', 'big-bowl-noodles', 'duck',
  'sushi-roll', 'sushi-sashimi', 'hand-roll', 'sushi-platter', 'sushi-combo',
  'family-meal', 'dessert', 'beverage', 'condiment'
];

const DIETARY_TAGS = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'];
const ALLERGENS = ['nuts', 'shellfish', 'eggs', 'dairy', 'gluten', 'soy', 'fish'];

export const MenuItemManager: React.FC<MenuItemManagerProps> = ({ className = '' }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<CreateMenuItemRequest>({
    name: '',
    description: '',
    category: 'appetizer',
    price: 0,
    ingredients: [],
    dietaryTags: [],
    allergens: [],
    spiceLevel: undefined,
    preparationTime: 15,
    availability: { isAvailable: true }
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await MenuService.getMenuItems();
      if (response.success && response.data) {
        // API returns data directly as array in the response
        setMenuItems(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.error || 'Failed to load menu items');
      }
    } catch (err) {
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        price: Math.round(formData.price * 100) // Convert to cents
      };

      if (editingItem) {
        const response = await ConfigService.updateMenuItem(editingItem.id, dataToSubmit);
        if (response.success) {
          loadMenuItems();
          resetForm();
        } else {
          setError(response.error || 'Failed to update menu item');
        }
      } else {
        const response = await ConfigService.createMenuItem(dataToSubmit);
        if (response.success) {
          loadMenuItems();
          resetForm();
        } else {
          setError(response.error || 'Failed to create menu item');
        }
      }
    } catch (err) {
      setError('Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      const response = await ConfigService.deleteMenuItem(id);
      if (response.success) {
        loadMenuItems();
      } else {
        setError(response.error || 'Failed to delete menu item');
      }
    } catch (err) {
      setError('Failed to delete menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price / 100, // Convert from cents to dollars for display
      ingredients: item.ingredients || [],
      dietaryTags: item.dietaryTags || [],
      allergens: item.allergens || [],
      spiceLevel: typeof item.spiceLevel === 'number' ? item.spiceLevel : undefined,
      preparationTime: item.preparationTime || 15,
      availability: item.isAvailable !== undefined 
        ? { isAvailable: item.isAvailable }
        : { isAvailable: true }
    });
    setShowForm(true);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData({
        ...formData,
        ingredients: [...(formData.ingredients || []), ingredientInput.trim()]
      });
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((_, i) => i !== index) || []
    });
  };

  const toggleDietaryTag = (tag: string) => {
    const current = formData.dietaryTags || [];
    setFormData({
      ...formData,
      dietaryTags: current.includes(tag) 
        ? current.filter(t => t !== tag) 
        : [...current, tag]
    });
  };

  const toggleAllergen = (allergen: string) => {
    const current = formData.allergens || [];
    setFormData({
      ...formData,
      allergens: current.includes(allergen) 
        ? current.filter(a => a !== allergen) 
        : [...current, allergen]
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'appetizer',
      price: 0,
      ingredients: [],
      dietaryTags: [],
      allergens: [],
      spiceLevel: undefined,
      preparationTime: 15,
      availability: { isAvailable: true }
    });
    setIngredientInput('');
    setError(null);
  };

  const filteredItems = filterCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filterCategory);

  const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

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
            <UtensilsCrossed className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Menu Item
          </button>
        </div>
        <p className="text-gray-500 mt-2">
          Manage your restaurant&apos;s menu items, prices, and availability
        </p>
      </div>

      {error && (
        <div className="m-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-800 underline">Dismiss</button>
        </div>
      )}

      {/* Category Filter */}
      <div className="px-6 pt-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            filterCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({menuItems.length})
        </button>
        {MENU_CATEGORIES.map(cat => {
          const count = menuItems.filter(i => i.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filterCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.replace('-', ' ')} ({count})
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
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., General Tso's Chicken"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {MENU_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the dish for customers and the AI..."
                required
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                <input
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 15 })}
                  min={1}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spice Level (1-5)</label>
                <input
                  type="number"
                  value={formData.spiceLevel || ''}
                  onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value ? parseInt(e.target.value) : undefined })}
                  min={1}
                  max={5}
                  placeholder="Optional"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Add ingredient"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.ingredients?.map((ingredient, index) => (
                  <span key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {ingredient}
                    <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-gray-400 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Dietary Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Tags</label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.dietaryTags?.includes(tag)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Allergens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contains Allergens</label>
              <div className="flex flex-wrap gap-2">
                {ALLERGENS.map(allergen => (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.allergens?.includes(allergen)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.availability?.isAvailable ?? true}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  availability: { isAvailable: e.target.checked } 
                })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-700">Available for ordering</label>
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
                {saving ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items List */}
      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No menu items found.</p>
            <p className="text-sm">Click &ldquo;Add Menu Item&rdquo; to create your menu.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg ${item.isAvailable !== false ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded capitalize">
                        {item.category.replace('-', ' ')}
                      </span>
                      <span className="flex items-center text-lg font-bold text-green-600">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      {item.preparationTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.preparationTime} min
                        </span>
                      )}
                      {item.spiceLevel && (
                        <span className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          Spice: {item.spiceLevel}/5
                        </span>
                      )}
                      {item.dietaryTags && item.dietaryTags.length > 0 && (
                        <div className="flex gap-1">
                          {item.dietaryTags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="flex gap-1">
                          {item.allergens.map(allergen => (
                            <span key={allergen} className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {item.isAvailable === false && (
                      <p className="text-red-600 text-sm mt-2">Currently unavailable</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Edit item"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete item"
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

      {/* Summary */}
      {menuItems.length > 0 && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-8 text-sm text-gray-600">
            <span>
              <strong className="text-gray-900">{menuItems.length}</strong> Total Items
            </span>
            <span>
              <strong className="text-green-600">{menuItems.filter(i => i.isAvailable !== false).length}</strong> Available
            </span>
            <span>
              <strong className="text-gray-900">{new Set(menuItems.map(i => i.category)).size}</strong> Categories
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemManager;
