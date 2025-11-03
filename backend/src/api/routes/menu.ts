import { Router, Request, Response } from 'express';
import { MenuItem, MenuItemValidator } from '../../models/MenuItem';
import { z } from 'zod';

const router = Router();

// Mock data for development - will be replaced with database queries
const mockMenuItems: MenuItem[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with house-made croutons, parmesan cheese, and our signature Caesar dressing. Perfect for health-conscious diners.',
    category: 'appetizer',
    price: 1299, // $12.99
    ingredients: ['romaine lettuce', 'croutons', 'parmesan cheese', 'caesar dressing'],
    dietaryTags: ['vegetarian'],
    allergens: ['dairy', 'gluten'],
    spiceLevel: 1,
    preparationTime: 10,
    availability: {
      isAvailable: true
    },
    popularityScore: 85,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03')
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon grilled to perfection, served with lemon herb butter and seasonal vegetables. Rich in omega-3 fatty acids.',
    category: 'entree',
    price: 2499, // $24.99
    ingredients: ['atlantic salmon', 'lemon', 'herbs', 'seasonal vegetables', 'butter'],
    dietaryTags: ['gluten-free'],
    allergens: ['fish', 'dairy'],
    spiceLevel: 2,
    preparationTime: 18,
    availability: {
      isAvailable: true
    },
    nutritionInfo: {
      calories: 350,
      protein: 35,
      carbs: 8,
      fat: 18
    },
    popularityScore: 92,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03')
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Spicy Thai Curry',
    description: 'Aromatic red curry with coconut milk, fresh vegetables, and your choice of protein. Authentic Thai flavors with customizable spice level.',
    category: 'entree',
    price: 1899, // $18.99
    ingredients: ['coconut milk', 'red curry paste', 'vegetables', 'basil', 'rice'],
    dietaryTags: ['vegan', 'gluten-free'],
    allergens: [],
    spiceLevel: 4,
    preparationTime: 15,
    availability: {
      isAvailable: true
    },
    popularityScore: 78,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03')
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Chocolate Lava Cake',
    description: 'Decadent chocolate cake with a molten center, served with vanilla ice cream. The perfect ending to your meal.',
    category: 'dessert',
    price: 899, // $8.99
    ingredients: ['dark chocolate', 'butter', 'eggs', 'flour', 'vanilla ice cream'],
    dietaryTags: ['vegetarian'],
    allergens: ['dairy', 'eggs', 'gluten'],
    preparationTime: 12,
    availability: {
      isAvailable: false,
      reason: 'Temporarily out of stock'
    },
    popularityScore: 88,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03')
  }
];

// Query parameters schema for menu items
const MenuQuerySchema = z.object({
  category: z.enum(['appetizer', 'entree', 'dessert', 'beverage']).optional(),
  available: z.string().transform(val => val === 'true').optional(),
  dietary: z.string().optional(), // Comma-separated dietary tags
  maxPrice: z.string().transform(val => parseInt(val)).optional(),
  spiceLevel: z.string().transform(val => parseInt(val)).optional(),
  limit: z.string().transform(val => parseInt(val)).default('20'),
  offset: z.string().transform(val => parseInt(val)).default('0')
});

// GET /api/menu/items - Get menu items with filtering
router.get('/items', async (req: Request, res: Response) => {
  try {
    const query = MenuQuerySchema.parse(req.query);
    
    let filteredItems = mockMenuItems;

    // Filter by category
    if (query.category) {
      filteredItems = filteredItems.filter(item => item.category === query.category);
    }

    // Filter by availability
    if (query.available !== undefined) {
      filteredItems = filteredItems.filter(item => 
        MenuItemValidator.isAvailable(item) === query.available
      );
    }

    // Filter by dietary tags
    if (query.dietary) {
      const dietaryTags = query.dietary.split(',');
      filteredItems = filteredItems.filter(item =>
        dietaryTags.every(tag => item.dietaryTags.includes(tag as any))
      );
    }

    // Filter by max price
    if (query.maxPrice) {
      filteredItems = filteredItems.filter(item => item.price <= query.maxPrice!);
    }

    // Filter by spice level
    if (query.spiceLevel) {
      filteredItems = filteredItems.filter(item => 
        item.spiceLevel && item.spiceLevel <= query.spiceLevel!
      );
    }

    // Sort by popularity score (descending)
    filteredItems.sort((a, b) => b.popularityScore - a.popularityScore);

    // Apply pagination
    const total = filteredItems.length;
    const paginatedItems = filteredItems.slice(query.offset, query.offset + query.limit);

    // Transform prices to dollars for response
    const responseItems = paginatedItems.map(item => ({
      ...item,
      priceInDollars: MenuItemValidator.calculatePriceInDollars(item)
    }));

    return res.json({
      success: true,
      data: responseItems,
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
        hasMore: query.offset + query.limit < total
      },
      filters: {
        category: query.category,
        available: query.available,
        dietary: query.dietary,
        maxPrice: query.maxPrice,
        spiceLevel: query.spiceLevel
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors
      });
    } else {
      console.error('Menu items error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch menu items'
      });
    }
  }
});

// GET /api/menu/items/:id - Get specific menu item
router.get('/items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const menuItem = mockMenuItems.find(item => item.id === id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    const responseItem = {
      ...menuItem,
      priceInDollars: MenuItemValidator.calculatePriceInDollars(menuItem)
    };

    return res.json({
      success: true,
      data: responseItem
    });

  } catch (error) {
    console.error('Menu item fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch menu item'
    });
  }
});

// GET /api/menu/categories - Get menu categories with counts
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = ['appetizer', 'entree', 'dessert', 'beverage'] as const;
    
    const categoryCounts = categories.map(category => {
      const items = mockMenuItems.filter(item => item.category === category);
      const availableItems = items.filter(item => MenuItemValidator.isAvailable(item));
      
      return {
        category,
        totalItems: items.length,
        availableItems: availableItems.length,
        averagePrice: items.length > 0 
          ? Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length)
          : 0,
        averagePriceInDollars: items.length > 0
          ? Math.round((items.reduce((sum, item) => sum + item.price, 0) / items.length) / 100 * 100) / 100
          : 0
      };
    });

    return res.json({
      success: true,
      data: categoryCounts
    });

  } catch (error) {
    console.error('Menu categories error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch menu categories'
    });
  }
});

// GET /api/menu/search - Search menu items by name or description
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, limit = '10' } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const searchTerm = q.toLowerCase();
    const searchLimit = parseInt(limit as string) || 10;

    const searchResults = mockMenuItems
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => {
        // Prioritize name matches over description matches
        const aNameMatch = a.name.toLowerCase().includes(searchTerm);
        const bNameMatch = b.name.toLowerCase().includes(searchTerm);
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        // Then sort by popularity
        return b.popularityScore - a.popularityScore;
      })
      .slice(0, searchLimit);

    const responseItems = searchResults.map(item => ({
      ...item,
      priceInDollars: MenuItemValidator.calculatePriceInDollars(item)
    }));

    return res.json({
      success: true,
      data: responseItems,
      searchTerm: q,
      resultCount: searchResults.length
    });

  } catch (error) {
    console.error('Menu search error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search menu items'
    });
  }
});

export default router;