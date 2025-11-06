import { Router, Request, Response } from 'express';
import { MenuItem, MenuItemValidator } from '../../models/MenuItem';
import { z } from 'zod';

const router = Router();

// Mock data for development - will be replaced with database queries
const mockMenuItems: MenuItem[] = [
  // Family Meals
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Dinner for 4',
    description:
      'Complete family dinner package including appetizer, two entrees, rice, and soup. Perfect for sharing with family and friends.',
    category: 'family-meal',
    price: 9000, // $90.00
    ingredients: ['mixed proteins', 'vegetables', 'rice', 'soup', 'appetizer'],
    dietaryTags: [],
    allergens: ['gluten', 'soy'],
    preparationTime: 25,
    availability: { isAvailable: true },
    popularityScore: 88,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Dinner for 6',
    description:
      'Generous family feast with variety of dishes including appetizers, three entrees, rice dishes, and soup for six people.',
    category: 'family-meal',
    price: 13000, // $130.00
    ingredients: ['mixed proteins', 'vegetables', 'rice', 'soup', 'appetizers'],
    dietaryTags: [],
    allergens: ['gluten', 'soy'],
    preparationTime: 30,
    availability: { isAvailable: true },
    popularityScore: 85,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Appetizers
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Vegetable Spring Roll',
    description:
      'Crispy golden spring roll filled with fresh vegetables and served with sweet and sour sauce. Light and crunchy appetizer.',
    category: 'appetizer',
    price: 300, // $3.00
    ingredients: ['cabbage', 'carrots', 'mushrooms', 'spring roll wrapper'],
    dietaryTags: ['vegetarian'],
    allergens: ['gluten'],
    spiceLevel: 1,
    preparationTime: 8,
    availability: { isAvailable: true },
    popularityScore: 75,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Pan Fried Dumplings (6)',
    description:
      'Six perfectly pan-fried dumplings with crispy bottom and tender filling. Served with soy dipping sauce.',
    category: 'appetizer',
    price: 1000, // $10.00
    ingredients: ['pork', 'cabbage', 'ginger', 'scallions', 'dumpling wrapper'],
    dietaryTags: [],
    allergens: ['gluten', 'soy'],
    spiceLevel: 2,
    preparationTime: 12,
    availability: { isAvailable: true },
    popularityScore: 92,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Crispy Calamari with 5 Spice Salt',
    description:
      'Fresh squid rings lightly battered and fried to golden perfection. Tossed with aromatic five-spice salt.',
    category: 'appetizer',
    price: 1600, // $16.00
    ingredients: ['squid', 'flour', 'five-spice powder', 'salt', 'peppers'],
    dietaryTags: [],
    allergens: ['gluten'],
    spiceLevel: 3,
    preparationTime: 10,
    availability: { isAvailable: true },
    popularityScore: 82,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Soups
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Hot & Sour Soup',
    description:
      'Traditional Chinese soup with silky tofu, mushrooms, and egg in a tangy and spicy broth. Comforting and warming.',
    category: 'soup',
    price: 800, // $8.00
    ingredients: ['tofu', 'mushrooms', 'egg', 'vinegar', 'white pepper'],
    dietaryTags: ['vegetarian'],
    allergens: ['eggs', 'soy'],
    spiceLevel: 3,
    preparationTime: 10,
    availability: { isAvailable: true },
    popularityScore: 78,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Wonton Soup',
    description:
      'Handmade pork wontons swimming in clear, flavorful chicken broth with bok choy. A classic comfort food.',
    category: 'soup',
    price: 950, // $9.50
    ingredients: ['pork wontons', 'chicken broth', 'bok choy', 'scallions'],
    dietaryTags: [],
    allergens: ['gluten', 'eggs'],
    spiceLevel: 1,
    preparationTime: 8,
    availability: { isAvailable: true },
    popularityScore: 85,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Chicken
  {
    id: '123e4567-e89b-12d3-a456-426614174008',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'General Tso Chicken',
    description:
      'Crispy chicken pieces glazed in sweet and tangy sauce. The most beloved Chinese-American dish with perfect balance of flavors.',
    category: 'chicken',
    price: 1500, // $15.00
    ingredients: [
      'chicken thigh',
      'cornstarch',
      'soy sauce',
      'sugar',
      'vinegar',
      'garlic',
    ],
    dietaryTags: [],
    allergens: ['gluten', 'soy'],
    spiceLevel: 2,
    preparationTime: 15,
    availability: { isAvailable: true },
    popularityScore: 95,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174009',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Szechuan Chicken',
    description:
      'Authentic Szechuan-style chicken with numbing Szechuan peppercorns and dried chilies. Bold and aromatic with signature ma-la flavor.',
    category: 'chicken',
    price: 1450, // $14.50
    ingredients: [
      'chicken',
      'szechuan peppercorns',
      'dried chilies',
      'garlic',
      'ginger',
    ],
    dietaryTags: [],
    allergens: ['soy'],
    spiceLevel: 4,
    preparationTime: 12,
    availability: { isAvailable: true },
    popularityScore: 88,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174010',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Cashew Chicken with Sweet Sauce',
    description:
      'Tender chicken stir-fried with roasted cashews, vegetables, and sweet hoisin-based sauce. Rich and satisfying.',
    category: 'chicken',
    price: 1600, // $16.00
    ingredients: [
      'chicken',
      'cashews',
      'bell peppers',
      'hoisin sauce',
      'soy sauce',
    ],
    dietaryTags: [],
    allergens: ['nuts', 'soy'],
    spiceLevel: 1,
    preparationTime: 14,
    availability: { isAvailable: true },
    popularityScore: 87,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Beef
  {
    id: '123e4567-e89b-12d3-a456-426614174011',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Orange Beef',
    description:
      'Crispy beef strips glazed in zesty orange sauce with fresh orange zest. Sweet, tangy, and irresistibly fragrant.',
    category: 'beef',
    price: 1750, // $17.50
    ingredients: [
      'beef',
      'orange juice',
      'orange zest',
      'soy sauce',
      'sugar',
      'cornstarch',
    ],
    dietaryTags: [],
    allergens: ['soy', 'gluten'],
    spiceLevel: 2,
    preparationTime: 16,
    availability: { isAvailable: true },
    popularityScore: 89,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174012',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Mongolian Beef',
    description:
      'Tender beef slices stir-fried with scallions and onions in savory sauce. Simple yet deeply flavorful classic.',
    category: 'beef',
    price: 1750, // $17.50
    ingredients: ['beef', 'scallions', 'onions', 'soy sauce', 'hoisin sauce'],
    dietaryTags: [],
    allergens: ['soy'],
    spiceLevel: 2,
    preparationTime: 12,
    availability: { isAvailable: true },
    popularityScore: 86,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174013',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Beef with Broccoli',
    description:
      'Classic combination of tender beef and fresh broccoli in brown garlic sauce. Healthy and delicious.',
    category: 'beef',
    price: 1750, // $17.50
    ingredients: ['beef', 'broccoli', 'garlic', 'oyster sauce', 'soy sauce'],
    dietaryTags: [],
    allergens: ['soy'],
    spiceLevel: 1,
    preparationTime: 10,
    availability: { isAvailable: true },
    popularityScore: 82,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Seafood
  {
    id: '123e4567-e89b-12d3-a456-426614174014',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Palace Shrimp',
    description:
      'Premium shrimp prepared in our signature palace-style sauce with vegetables. Elegant and refined flavors.',
    category: 'seafood',
    price: 1650, // $16.50
    ingredients: ['shrimp', 'snow peas', 'carrots', 'palace sauce', 'garlic'],
    dietaryTags: [],
    allergens: ['shellfish', 'soy'],
    spiceLevel: 1,
    preparationTime: 10,
    availability: { isAvailable: true },
    popularityScore: 88,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174015',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Szechuan Shrimp',
    description:
      'Fresh shrimp stir-fried with Szechuan peppercorns and chilies. Numbing and spicy authentic Szechuan preparation.',
    category: 'seafood',
    price: 1650, // $16.50
    ingredients: [
      'shrimp',
      'szechuan peppercorns',
      'dried chilies',
      'garlic',
      'ginger',
    ],
    dietaryTags: [],
    allergens: ['shellfish', 'soy'],
    spiceLevel: 4,
    preparationTime: 8,
    availability: { isAvailable: true },
    popularityScore: 85,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Vegetable
  {
    id: '123e4567-e89b-12d3-a456-426614174016',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Ma Po Tofu',
    description:
      'Silky tofu in spicy Szechuan sauce with ground pork and fermented beans. Classic comfort food with bold flavors.',
    category: 'vegetable',
    price: 1200, // $12.00
    ingredients: [
      'soft tofu',
      'ground pork',
      'fermented black beans',
      'szechuan peppercorns',
      'chili oil',
    ],
    dietaryTags: [],
    allergens: ['soy'],
    spiceLevel: 4,
    preparationTime: 10,
    availability: { isAvailable: true },
    popularityScore: 90,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174017',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Spicy Eggplant',
    description:
      'Chinese eggplant braised in garlic sauce with a hint of spice. Silky texture with rich, savory flavors.',
    category: 'vegetable',
    price: 1250, // $12.50
    ingredients: [
      'chinese eggplant',
      'garlic',
      'soy sauce',
      'chili paste',
      'sugar',
    ],
    dietaryTags: ['vegan'],
    allergens: ['soy'],
    spiceLevel: 3,
    preparationTime: 15,
    availability: { isAvailable: true },
    popularityScore: 78,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Noodles
  {
    id: '123e4567-e89b-12d3-a456-426614174018',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Pad Thai',
    description:
      'Thai stir-fried rice noodles with shrimp, bean sprouts, eggs, and tamarind sauce. Sweet, sour, and satisfying.',
    category: 'noodle',
    price: 1550, // $15.50
    ingredients: [
      'rice noodles',
      'shrimp',
      'bean sprouts',
      'eggs',
      'tamarind sauce',
      'peanuts',
    ],
    dietaryTags: [],
    allergens: ['shellfish', 'eggs', 'nuts'],
    spiceLevel: 2,
    preparationTime: 12,
    availability: { isAvailable: true },
    popularityScore: 92,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174019',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Szechuan Noodles',
    description:
      'Thick noodles in spicy Szechuan sauce with preserved vegetables and minced pork. Authentic street food flavors.',
    category: 'noodle',
    price: 1500, // $15.00
    ingredients: [
      'wheat noodles',
      'szechuan sauce',
      'preserved vegetables',
      'ground pork',
      'scallions',
    ],
    dietaryTags: [],
    allergens: ['gluten', 'soy'],
    spiceLevel: 4,
    preparationTime: 10,
    availability: { isAvailable: true },
    popularityScore: 87,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Fried Rice
  {
    id: '123e4567-e89b-12d3-a456-426614174020',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'House Fried Rice',
    description:
      'Our signature fried rice with shrimp, chicken, and Chinese sausage. Wok-fried to perfection with eggs and vegetables.',
    category: 'fried-rice',
    price: 1500, // $15.00
    ingredients: [
      'rice',
      'shrimp',
      'chicken',
      'chinese sausage',
      'eggs',
      'peas',
      'carrots',
    ],
    dietaryTags: [],
    allergens: ['shellfish', 'eggs', 'soy'],
    spiceLevel: 1,
    preparationTime: 8,
    availability: { isAvailable: true },
    popularityScore: 88,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174021',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Szechuan Fried Rice',
    description:
      'Spicy fried rice with Szechuan preserved vegetables and chili oil. Bold flavors with numbing Szechuan peppercorns.',
    category: 'fried-rice',
    price: 1300, // $13.00
    ingredients: [
      'rice',
      'szechuan preserved vegetables',
      'chili oil',
      'szechuan peppercorns',
      'scallions',
    ],
    dietaryTags: ['vegan'],
    allergens: ['soy'],
    spiceLevel: 3,
    preparationTime: 8,
    availability: { isAvailable: true },
    popularityScore: 83,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Sushi Rolls
  {
    id: '123e4567-e89b-12d3-a456-426614174022',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'California Roll (6)',
    description:
      'Classic sushi roll with crab, avocado, and cucumber. Perfect introduction to sushi for beginners.',
    category: 'sushi-roll',
    price: 700, // $7.00
    ingredients: ['crab', 'avocado', 'cucumber', 'nori', 'sushi rice'],
    dietaryTags: [],
    allergens: ['shellfish'],
    preparationTime: 5,
    availability: { isAvailable: true },
    popularityScore: 90,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174023',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Spicy Salmon Roll (6)',
    description:
      'Fresh salmon mixed with spicy mayo and wrapped in seasoned rice and nori. Creamy and flavorful.',
    category: 'sushi-roll',
    price: 850, // $8.50
    ingredients: ['salmon', 'spicy mayo', 'nori', 'sushi rice', 'sesame seeds'],
    dietaryTags: [],
    allergens: ['fish', 'eggs'],
    preparationTime: 5,
    availability: { isAvailable: true },
    popularityScore: 87,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174024',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Dragon Roll (8)',
    description:
      'Premium specialty roll with eel, cucumber, topped with avocado and eel sauce. Visually stunning and delicious.',
    category: 'sushi-roll',
    price: 1600, // $16.00
    ingredients: [
      'eel',
      'cucumber',
      'avocado',
      'eel sauce',
      'tobiko',
      'sushi rice',
    ],
    dietaryTags: [],
    allergens: ['fish'],
    preparationTime: 8,
    availability: { isAvailable: true },
    popularityScore: 85,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Beverages
  {
    id: '123e4567-e89b-12d3-a456-426614174025',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Jasmine Tea',
    description:
      'Traditional Chinese jasmine tea with delicate floral aroma. Perfect complement to any meal.',
    category: 'beverage',
    price: 350, // $3.50
    ingredients: ['jasmine tea leaves', 'hot water'],
    dietaryTags: ['vegan', 'gluten-free'],
    allergens: [],
    preparationTime: 3,
    availability: { isAvailable: true },
    popularityScore: 70,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174026',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Fresh Lychee Juice',
    description:
      'Sweet and refreshing lychee juice made from fresh lychee fruit. Light and tropical flavor.',
    category: 'beverage',
    price: 450, // $4.50
    ingredients: ['fresh lychee', 'water', 'ice'],
    dietaryTags: ['vegan', 'gluten-free'],
    allergens: [],
    preparationTime: 2,
    availability: { isAvailable: true },
    popularityScore: 78,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },

  // Desserts
  {
    id: '123e4567-e89b-12d3-a456-426614174027',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Sesame Balls (4)',
    description:
      'Crispy glutinous rice balls filled with sweet red bean paste and coated with sesame seeds. Traditional Chinese dessert.',
    category: 'dessert',
    price: 650, // $6.50
    ingredients: [
      'glutinous rice flour',
      'red bean paste',
      'sesame seeds',
      'oil',
    ],
    dietaryTags: ['vegan'],
    allergens: [],
    preparationTime: 8,
    availability: { isAvailable: true },
    popularityScore: 75,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174028',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Mango Pudding',
    description:
      'Silky smooth mango pudding topped with fresh mango pieces. Light and refreshing way to end your meal.',
    category: 'dessert',
    price: 550, // $5.50
    ingredients: ['mango puree', 'gelatin', 'sugar', 'fresh mango'],
    dietaryTags: ['gluten-free'],
    allergens: [],
    preparationTime: 5,
    availability: { isAvailable: true },
    popularityScore: 82,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-03'),
  },
];

// Query parameters schema for menu items
const MenuQuerySchema = z.object({
  category: z
    .enum([
      'appetizer',
      'soup',
      'chicken',
      'beef',
      'pork',
      'seafood',
      'vegetable',
      'noodle',
      'fried-rice',
      'rice-platter',
      'big-bowl-noodles',
      'duck',
      'sushi-roll',
      'sushi-sashimi',
      'hand-roll',
      'sushi-platter',
      'sushi-combo',
      'family-meal',
      'dessert',
      'beverage',
      'condiment',
    ])
    .optional(),
  available: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  dietary: z.string().optional(), // Comma-separated dietary tags
  maxPrice: z
    .string()
    .transform(val => parseInt(val))
    .optional(),
  spiceLevel: z
    .string()
    .transform(val => parseInt(val))
    .optional(),
  limit: z
    .string()
    .transform(val => parseInt(val))
    .default('20'),
  offset: z
    .string()
    .transform(val => parseInt(val))
    .default('0'),
});

// GET /api/menu/items - Get menu items with filtering
router.get('/items', async (req: Request, res: Response) => {
  try {
    const query = MenuQuerySchema.parse(req.query);

    let filteredItems = mockMenuItems;

    // Filter by category
    if (query.category) {
      filteredItems = filteredItems.filter(
        item => item.category === query.category
      );
    }

    // Filter by availability
    if (query.available !== undefined) {
      filteredItems = filteredItems.filter(
        item => MenuItemValidator.isAvailable(item) === query.available
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
      filteredItems = filteredItems.filter(
        item => item.price <= query.maxPrice!
      );
    }

    // Filter by spice level
    if (query.spiceLevel) {
      filteredItems = filteredItems.filter(
        item => item.spiceLevel && item.spiceLevel <= query.spiceLevel!
      );
    }

    // Sort by popularity score (descending)
    filteredItems.sort((a, b) => b.popularityScore - a.popularityScore);

    // Apply pagination
    const total = filteredItems.length;
    const paginatedItems = filteredItems.slice(
      query.offset,
      query.offset + query.limit
    );

    // Transform prices to dollars for response
    const responseItems = paginatedItems.map(item => ({
      ...item,
      priceInDollars: MenuItemValidator.calculatePriceInDollars(item),
    }));

    return res.json({
      success: true,
      data: responseItems,
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
        hasMore: query.offset + query.limit < total,
      },
      filters: {
        category: query.category,
        available: query.available,
        dietary: query.dietary,
        maxPrice: query.maxPrice,
        spiceLevel: query.spiceLevel,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors,
      });
    } else {
      console.error('Menu items error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch menu items',
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
        error: 'Menu item not found',
      });
    }

    const responseItem = {
      ...menuItem,
      priceInDollars: MenuItemValidator.calculatePriceInDollars(menuItem),
    };

    return res.json({
      success: true,
      data: responseItem,
    });
  } catch (error) {
    console.error('Menu item fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch menu item',
    });
  }
});

// GET /api/menu/categories - Get menu categories with counts
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = [
      'family-meal',
      'appetizer',
      'soup',
      'chicken',
      'beef',
      'pork',
      'seafood',
      'vegetable',
      'noodle',
      'fried-rice',
      'rice-platter',
      'big-bowl-noodles',
      'duck',
      'sushi-roll',
      'sushi-sashimi',
      'hand-roll',
      'sushi-platter',
      'sushi-combo',
      'dessert',
      'beverage',
      'condiment',
    ] as const;

    const categoryCounts = categories
      .map(category => {
        const items = mockMenuItems.filter(item => item.category === category);
        const availableItems = items.filter(item =>
          MenuItemValidator.isAvailable(item)
        );

        return {
          category,
          totalItems: items.length,
          availableItems: availableItems.length,
          averagePrice:
            items.length > 0
              ? Math.round(
                  items.reduce((sum, item) => sum + item.price, 0) /
                    items.length
                )
              : 0,
          averagePriceInDollars:
            items.length > 0
              ? Math.round(
                  (items.reduce((sum, item) => sum + item.price, 0) /
                    items.length /
                    100) *
                    100
                ) / 100
              : 0,
        };
      })
      .filter(category => category.totalItems > 0); // Only show categories with items

    return res.json({
      success: true,
      data: categoryCounts,
    });
  } catch (error) {
    console.error('Menu categories error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch menu categories',
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
        error: 'Search query is required',
      });
    }

    const searchTerm = q.toLowerCase();
    const searchLimit = parseInt(limit as string) || 10;

    const searchResults = mockMenuItems
      .filter(
        item =>
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
      priceInDollars: MenuItemValidator.calculatePriceInDollars(item),
    }));

    return res.json({
      success: true,
      data: responseItems,
      searchTerm: q,
      resultCount: searchResults.length,
    });
  } catch (error) {
    console.error('Menu search error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search menu items',
    });
  }
});

export default router;
