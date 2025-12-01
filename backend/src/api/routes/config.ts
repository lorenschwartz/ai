import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { 
  Table, 
  TableValidator, 
  CreateTableSchema, 
  UpdateTableSchema 
} from '../../models/Table';
import {
  SpecialInstruction,
  SpecialInstructionValidator,
  CreateSpecialInstructionSchema,
  UpdateSpecialInstructionSchema
} from '../../models/SpecialInstruction';
import { MenuItem, MenuItemValidator } from '../../models/MenuItem';
import { Restaurant } from '../../models/Restaurant';
import { PaymentMethod } from '../../models/types';

const router = Router();

// Default restaurant ID for demo purposes
const DEFAULT_RESTAURANT_ID = '123e4567-e89b-12d3-a456-426614174002';

// Mock data for development - will be replaced with database queries
let mockRestaurant: Restaurant = {
  id: DEFAULT_RESTAURANT_ID,
  name: 'AI-Mi Restaurant',
  settings: {
    businessHours: {
      monday: { open: '11:00', close: '22:00', isOpen: true },
      tuesday: { open: '11:00', close: '22:00', isOpen: true },
      wednesday: { open: '11:00', close: '22:00', isOpen: true },
      thursday: { open: '11:00', close: '22:00', isOpen: true },
      friday: { open: '11:00', close: '23:00', isOpen: true },
      saturday: { open: '11:00', close: '23:00', isOpen: true },
      sunday: { open: '12:00', close: '21:00', isOpen: true }
    },
    paymentMethods: [PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD, PaymentMethod.APPLE_PAY, PaymentMethod.CASH],
    taxRate: 0.08,
    tipSuggestions: [15, 18, 20, 25],
    posIntegration: {
      provider: 'square',
      apiKey: 'encrypted_key',
      webhookUrl: 'https://example.com/webhook'
    }
  },
  branding: {
    tone: 'friendly',
    welcomeMessage: 'Welcome to AI-Mi! I\'m your AI assistant. How can I help you today?'
  },
  createdAt: new Date('2025-11-01'),
  updatedAt: new Date('2025-11-01')
};

let mockTables: Table[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614175001',
    restaurantId: DEFAULT_RESTAURANT_ID,
    tableNumber: 'T1',
    capacity: 2,
    location: 'Main dining - by window',
    status: 'available',
    isActive: true,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01')
  },
  {
    id: '123e4567-e89b-12d3-a456-426614175002',
    restaurantId: DEFAULT_RESTAURANT_ID,
    tableNumber: 'T2',
    capacity: 4,
    location: 'Main dining - center',
    status: 'available',
    isActive: true,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01')
  },
  {
    id: '123e4567-e89b-12d3-a456-426614175003',
    restaurantId: DEFAULT_RESTAURANT_ID,
    tableNumber: 'Booth 1',
    capacity: 6,
    location: 'Booth section',
    status: 'available',
    isActive: true,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01')
  },
  {
    id: '123e4567-e89b-12d3-a456-426614175004',
    restaurantId: DEFAULT_RESTAURANT_ID,
    tableNumber: 'Patio 1',
    capacity: 4,
    location: 'Outdoor patio',
    status: 'available',
    isActive: true,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01')
  }
];

let mockSpecialInstructions: SpecialInstruction[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614176001',
    restaurantId: DEFAULT_RESTAURANT_ID,
    title: 'Allergy Verification',
    content: 'Always confirm any food allergies with customers before recommending dishes. If a customer mentions an allergy, explicitly list which menu items are safe.',
    type: 'dietary',
    priority: 'critical',
    isActive: true,
    showToAI: true,
    createdBy: 'Chef Wang',
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01')
  },
  {
    id: '123e4567-e89b-12d3-a456-426614176002',
    restaurantId: DEFAULT_RESTAURANT_ID,
    title: 'Spice Level Recommendation',
    content: 'When customers ask about spice levels, explain that our Szechuan dishes are authentically spicy. Recommend starting with level 2-3 for newcomers.',
    type: 'service',
    priority: 'medium',
    isActive: true,
    showToAI: true,
    createdBy: 'Chef Wang',
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01')
  },
  {
    id: '123e4567-e89b-12d3-a456-426614176003',
    restaurantId: DEFAULT_RESTAURANT_ID,
    title: 'Daily Special: Fresh Salmon',
    content: 'Today\'s special is Pan-Seared Salmon with citrus glaze - $22. Limited to 20 portions.',
    type: 'promotional',
    priority: 'high',
    isActive: true,
    showToAI: true,
    createdBy: 'Manager',
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01')
  }
];

// In-memory menu items storage (imported from menu route for CRUD operations)
let mockMenuItems: MenuItem[] = [];

// Initialize with some default items
const initializeMenuItems = () => {
  if (mockMenuItems.length === 0) {
    mockMenuItems = [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        restaurantId: DEFAULT_RESTAURANT_ID,
        name: 'Dinner for 4',
        description: 'Complete family dinner package including appetizer, two entrees, rice, and soup.',
        category: 'family-meal',
        price: 9000,
        ingredients: ['mixed proteins', 'vegetables', 'rice', 'soup', 'appetizer'],
        dietaryTags: [],
        allergens: ['gluten', 'soy'],
        preparationTime: 25,
        availability: { isAvailable: true },
        popularityScore: 88,
        createdAt: new Date('2025-11-01'),
        updatedAt: new Date('2025-11-03'),
      }
    ];
  }
};

initializeMenuItems();

// ==================== Restaurant Configuration Routes ====================

// GET /api/v1/config/restaurant - Get restaurant configuration
router.get('/restaurant', async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      data: mockRestaurant
    });
  } catch (error) {
    console.error('Get restaurant config error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch restaurant configuration'
    });
  }
});

// PUT /api/v1/config/restaurant - Update restaurant configuration
router.put('/restaurant', async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    
    mockRestaurant = {
      ...mockRestaurant,
      ...updates,
      settings: updates.settings ? { ...mockRestaurant.settings, ...updates.settings } : mockRestaurant.settings,
      branding: updates.branding ? { ...mockRestaurant.branding, ...updates.branding } : mockRestaurant.branding,
      updatedAt: new Date()
    };

    return res.json({
      success: true,
      data: mockRestaurant
    });
  } catch (error) {
    console.error('Update restaurant config error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update restaurant configuration'
    });
  }
});

// ==================== Table Routes ====================

// GET /api/v1/config/tables - Get all tables
router.get('/tables', async (req: Request, res: Response) => {
  try {
    const { status, isActive } = req.query;
    
    let filteredTables = mockTables;
    
    if (status) {
      filteredTables = filteredTables.filter(t => t.status === status);
    }
    
    if (isActive !== undefined) {
      const active = isActive === 'true';
      filteredTables = filteredTables.filter(t => t.isActive === active);
    }

    return res.json({
      success: true,
      data: filteredTables,
      total: filteredTables.length
    });
  } catch (error) {
    console.error('Get tables error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch tables'
    });
  }
});

// GET /api/v1/config/tables/:id - Get specific table
router.get('/tables/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const table = mockTables.find(t => t.id === id);

    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }

    return res.json({
      success: true,
      data: table
    });
  } catch (error) {
    console.error('Get table error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch table'
    });
  }
});

// POST /api/v1/config/tables - Create new table
router.post('/tables', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateTableSchema.parse({
      ...req.body,
      restaurantId: DEFAULT_RESTAURANT_ID
    });

    // Check for duplicate table number
    if (mockTables.some(t => t.tableNumber === validatedData.tableNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Table number already exists'
      });
    }

    const newTable: Table = {
      id: uuidv4(),
      restaurantId: validatedData.restaurantId,
      tableNumber: validatedData.tableNumber,
      capacity: validatedData.capacity,
      status: validatedData.status ?? 'available',
      isActive: validatedData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add optional properties only if they have values
    if (validatedData.location) {
      newTable.location = validatedData.location;
    }
    if (validatedData.qrCodeUrl) {
      newTable.qrCodeUrl = validatedData.qrCodeUrl;
    }

    mockTables.push(newTable);

    return res.status(201).json({
      success: true,
      data: newTable
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid table data',
        details: error.errors
      });
    }
    console.error('Create table error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create table'
    });
  }
});

// PUT /api/v1/config/tables/:id - Update table
router.put('/tables/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tableIndex = mockTables.findIndex(t => t.id === id);

    if (tableIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }

    const validatedData = UpdateTableSchema.parse(req.body);

    // Check for duplicate table number if being updated
    if (validatedData.tableNumber && 
        mockTables.some(t => t.tableNumber === validatedData.tableNumber && t.id !== id)) {
      return res.status(400).json({
        success: false,
        error: 'Table number already exists'
      });
    }

    const existingTable = mockTables[tableIndex]!;
    const updatedTable: Table = {
      ...existingTable,
      updatedAt: new Date()
    };
    
    // Only update defined values
    if (validatedData.tableNumber !== undefined) {
      updatedTable.tableNumber = validatedData.tableNumber;
    }
    if (validatedData.capacity !== undefined) {
      updatedTable.capacity = validatedData.capacity;
    }
    if (validatedData.location !== undefined) {
      updatedTable.location = validatedData.location;
    }
    if (validatedData.status !== undefined) {
      updatedTable.status = validatedData.status;
    }
    if (validatedData.qrCodeUrl !== undefined) {
      updatedTable.qrCodeUrl = validatedData.qrCodeUrl;
    }
    if (validatedData.isActive !== undefined) {
      updatedTable.isActive = validatedData.isActive;
    }
    
    mockTables[tableIndex] = updatedTable;

    return res.json({
      success: true,
      data: mockTables[tableIndex]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid table data',
        details: error.errors
      });
    }
    console.error('Update table error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update table'
    });
  }
});

// DELETE /api/v1/config/tables/:id - Delete table
router.delete('/tables/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tableIndex = mockTables.findIndex(t => t.id === id);

    if (tableIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }

    mockTables.splice(tableIndex, 1);

    return res.json({
      success: true,
      message: 'Table deleted successfully'
    });
  } catch (error) {
    console.error('Delete table error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete table'
    });
  }
});

// ==================== Special Instructions Routes ====================

// GET /api/v1/config/instructions - Get all special instructions
router.get('/instructions', async (req: Request, res: Response) => {
  try {
    const { type, priority, isActive, showToAI } = req.query;
    
    let filteredInstructions = mockSpecialInstructions;
    
    if (type) {
      filteredInstructions = filteredInstructions.filter(i => i.type === type);
    }
    
    if (priority) {
      filteredInstructions = filteredInstructions.filter(i => i.priority === priority);
    }
    
    if (isActive !== undefined) {
      const active = isActive === 'true';
      filteredInstructions = filteredInstructions.filter(i => i.isActive === active);
    }
    
    if (showToAI !== undefined) {
      const show = showToAI === 'true';
      filteredInstructions = filteredInstructions.filter(i => i.showToAI === show);
    }

    // Sort by priority
    const priorityOrder: { [key: string]: number } = { critical: 0, high: 1, medium: 2, low: 3 };
    filteredInstructions.sort((a, b) => priorityOrder[a.priority]! - priorityOrder[b.priority]!);

    return res.json({
      success: true,
      data: filteredInstructions,
      total: filteredInstructions.length
    });
  } catch (error) {
    console.error('Get instructions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch special instructions'
    });
  }
});

// GET /api/v1/config/instructions/ai - Get instructions for AI context
router.get('/instructions/ai', async (req: Request, res: Response) => {
  try {
    const aiInstructions = SpecialInstructionValidator.getActiveInstructionsForAI(mockSpecialInstructions);

    return res.json({
      success: true,
      data: aiInstructions,
      total: aiInstructions.length
    });
  } catch (error) {
    console.error('Get AI instructions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch AI instructions'
    });
  }
});

// GET /api/v1/config/instructions/:id - Get specific instruction
router.get('/instructions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const instruction = mockSpecialInstructions.find(i => i.id === id);

    if (!instruction) {
      return res.status(404).json({
        success: false,
        error: 'Special instruction not found'
      });
    }

    return res.json({
      success: true,
      data: instruction
    });
  } catch (error) {
    console.error('Get instruction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch special instruction'
    });
  }
});

// POST /api/v1/config/instructions - Create new instruction
router.post('/instructions', async (req: Request, res: Response) => {
  try {
    const validatedData = CreateSpecialInstructionSchema.parse({
      ...req.body,
      restaurantId: DEFAULT_RESTAURANT_ID
    });

    const newInstruction: SpecialInstruction = {
      id: uuidv4(),
      restaurantId: validatedData.restaurantId,
      title: validatedData.title,
      content: validatedData.content,
      type: validatedData.type,
      priority: validatedData.priority ?? 'medium',
      isActive: validatedData.isActive ?? true,
      showToAI: validatedData.showToAI ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add optional properties only if they have values
    if (validatedData.validFrom) {
      newInstruction.validFrom = validatedData.validFrom;
    }
    if (validatedData.validUntil) {
      newInstruction.validUntil = validatedData.validUntil;
    }
    if (validatedData.createdBy) {
      newInstruction.createdBy = validatedData.createdBy;
    }

    mockSpecialInstructions.push(newInstruction);

    return res.status(201).json({
      success: true,
      data: newInstruction
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid instruction data',
        details: error.errors
      });
    }
    console.error('Create instruction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create special instruction'
    });
  }
});

// PUT /api/v1/config/instructions/:id - Update instruction
router.put('/instructions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const instructionIndex = mockSpecialInstructions.findIndex(i => i.id === id);

    if (instructionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Special instruction not found'
      });
    }

    const validatedData = UpdateSpecialInstructionSchema.parse(req.body);

    const existingInstruction = mockSpecialInstructions[instructionIndex]!;
    const updatedInstruction: SpecialInstruction = {
      ...existingInstruction,
      updatedAt: new Date()
    };
    
    // Only update defined values
    if (validatedData.title !== undefined) {
      updatedInstruction.title = validatedData.title;
    }
    if (validatedData.content !== undefined) {
      updatedInstruction.content = validatedData.content;
    }
    if (validatedData.type !== undefined) {
      updatedInstruction.type = validatedData.type;
    }
    if (validatedData.priority !== undefined) {
      updatedInstruction.priority = validatedData.priority;
    }
    if (validatedData.isActive !== undefined) {
      updatedInstruction.isActive = validatedData.isActive;
    }
    if (validatedData.showToAI !== undefined) {
      updatedInstruction.showToAI = validatedData.showToAI;
    }
    if (validatedData.validFrom !== undefined) {
      updatedInstruction.validFrom = validatedData.validFrom;
    }
    if (validatedData.validUntil !== undefined) {
      updatedInstruction.validUntil = validatedData.validUntil;
    }
    
    mockSpecialInstructions[instructionIndex] = updatedInstruction;

    return res.json({
      success: true,
      data: mockSpecialInstructions[instructionIndex]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid instruction data',
        details: error.errors
      });
    }
    console.error('Update instruction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update special instruction'
    });
  }
});

// DELETE /api/v1/config/instructions/:id - Delete instruction
router.delete('/instructions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const instructionIndex = mockSpecialInstructions.findIndex(i => i.id === id);

    if (instructionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Special instruction not found'
      });
    }

    mockSpecialInstructions.splice(instructionIndex, 1);

    return res.json({
      success: true,
      message: 'Special instruction deleted successfully'
    });
  } catch (error) {
    console.error('Delete instruction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete special instruction'
    });
  }
});

// ==================== Menu Item CRUD Routes (for Configuration) ====================

// POST /api/v1/config/menu-items - Create new menu item
router.post('/menu-items', async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const newItem: MenuItem = {
      id: uuidv4(),
      restaurantId: DEFAULT_RESTAURANT_ID,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      ingredients: req.body.ingredients || [],
      dietaryTags: req.body.dietaryTags || [],
      allergens: req.body.allergens || [],
      spiceLevel: req.body.spiceLevel,
      preparationTime: req.body.preparationTime || 15,
      availability: req.body.availability || { isAvailable: true },
      nutritionInfo: req.body.nutritionInfo,
      imageUrl: req.body.imageUrl,
      popularityScore: req.body.popularityScore || 50,
      createdAt: now,
      updatedAt: now
    };

    mockMenuItems.push(newItem);

    return res.status(201).json({
      success: true,
      data: {
        ...newItem,
        priceInDollars: MenuItemValidator.calculatePriceInDollars(newItem)
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid menu item data',
        details: error.errors
      });
    }
    console.error('Create menu item error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create menu item'
    });
  }
});

// PUT /api/v1/config/menu-items/:id - Update menu item
router.put('/menu-items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itemIndex = mockMenuItems.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    mockMenuItems[itemIndex] = {
      ...mockMenuItems[itemIndex]!,
      ...req.body,
      updatedAt: new Date()
    };

    return res.json({
      success: true,
      data: {
        ...mockMenuItems[itemIndex]!,
        priceInDollars: MenuItemValidator.calculatePriceInDollars(mockMenuItems[itemIndex]!)
      }
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update menu item'
    });
  }
});

// DELETE /api/v1/config/menu-items/:id - Delete menu item
router.delete('/menu-items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itemIndex = mockMenuItems.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    mockMenuItems.splice(itemIndex, 1);

    return res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete menu item'
    });
  }
});

export default router;
