// Menu Display Component
import React, { useState } from 'react';
import { Star, Clock, DollarSign, Leaf, AlertTriangle } from 'lucide-react';
import { useMenuItems, useMenuCategories } from '../../hooks/useApi';
import type { MenuItem, MenuCategory } from '../../types/api';

interface MenuDisplayProps {
  className?: string;
}

export const MenuDisplay: React.FC<MenuDisplayProps> = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: menuResponse, isLoading: menuLoading } = useMenuItems({
    filters:
      selectedCategory !== 'all' ? { category: selectedCategory } : undefined,
  });

  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useMenuCategories();

  const menuItems = menuResponse?.success ? menuResponse.data?.data || [] : [];
  const categories = categoriesResponse?.success
    ? categoriesResponse.data || []
    : [];

  // Filter items by search query
  const filteredItems = menuItems.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getDietaryBadges = (item: MenuItem) => {
    const badges = [];

    if (item.dietaryTags?.includes('vegetarian')) {
      badges.push({
        text: 'Vegetarian',
        color: 'bg-green-100 text-green-800',
        icon: Leaf,
      });
    }
    if (item.dietaryTags?.includes('vegan')) {
      badges.push({
        text: 'Vegan',
        color: 'bg-green-100 text-green-800',
        icon: Leaf,
      });
    }
    if (item.dietaryTags?.includes('gluten-free')) {
      badges.push({
        text: 'Gluten-Free',
        color: 'bg-blue-100 text-blue-800',
        icon: null,
      });
    }
    if (item.allergens && item.allergens.length > 0) {
      badges.push({
        text: 'Contains Allergens',
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
      });
    }

    return badges;
  };

  if (menuLoading || categoriesLoading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-sm ${className}`}>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/4'></div>
          <div className='space-y-3'>
            <div className='h-4 bg-gray-200 rounded w-full'></div>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Our Menu</h2>

        {/* Search Bar */}
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search menu items...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* Category Filters */}
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          {categories.map((category: MenuCategory) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedCategory === category.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className='p-6'>
        {filteredItems.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-gray-500'>
              No menu items found matching your criteria.
            </p>
          </div>
        ) : (
          <div className='grid gap-6'>
            {filteredItems.map((item: MenuItem) => {
              const badges = getDietaryBadges(item);

              return (
                <div
                  key={item.id}
                  className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                    !item.isAvailable ? 'opacity-60' : ''
                  }`}
                >
                  <div className='flex justify-between items-start mb-2'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {item.name}
                        </h3>
                        {item.popularity && item.popularity > 80 && (
                          <div className='flex items-center text-yellow-500'>
                            <Star className='h-4 w-4 fill-current' />
                            <span className='text-xs ml-1'>Popular</span>
                          </div>
                        )}
                      </div>
                      <p className='text-gray-600 text-sm mb-2'>
                        {item.description}
                      </p>

                      {/* Badges */}
                      {badges.length > 0 && (
                        <div className='flex flex-wrap gap-1 mb-2'>
                          {badges.map((badge, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                            >
                              {badge.icon && (
                                <badge.icon className='h-3 w-3 mr-1' />
                              )}
                              {badge.text}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Details */}
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <div className='flex items-center'>
                          <Clock className='h-4 w-4 mr-1' />
                          {item.preparationTime} min
                        </div>
                        {item.spiceLevel && item.spiceLevel !== 'mild' && (
                          <div className='flex items-center'>
                            <span className='mr-1'>🌶️</span>
                            Spice Level: {item.spiceLevel}
                          </div>
                        )}
                        {item.nutritionalInfo && (
                          <div>{item.nutritionalInfo.calories} cal</div>
                        )}
                      </div>

                      {!item.isAvailable && (
                        <div className='mt-2 text-red-600 text-sm font-medium'>
                          Currently unavailable
                        </div>
                      )}
                    </div>

                    <div className='text-right ml-4'>
                      <div className='flex items-center text-lg font-bold text-gray-900'>
                        <DollarSign className='h-5 w-5' />
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDisplay;
