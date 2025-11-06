import { Router, Request, Response } from 'express';
import { Customer, CustomerValidator } from '../../models/Customer';
import { session } from '../../config/database';
import { z } from 'zod';
import crypto from 'crypto';
import { DIETARY_TAGS, ALLERGENS } from '../../models/types';

const router = Router();

// Request schemas
const CreateCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  tableNumber: z.string().optional(),
  preferences: z.object({
    dietaryRestrictions: z.array(z.string()).default([]),
    allergies: z.array(z.string()).default([]),
    favoriteItems: z.array(z.string()).optional(),
    spiceLevel: z.enum(['mild', 'medium', 'hot', 'extra-hot']).default('medium'),
  }).optional().default({})
});

const UpdateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tableNumber: z.string().optional(),
  preferences: z.object({
    dietaryRestrictions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    spiceLevel: z.enum(['mild', 'medium', 'hot', 'extra-hot']).optional(),
    favoriteItems: z.array(z.string()).optional()
  }).optional()
});

// Mock storage for development
const mockCustomers = new Map<string, Customer>();

// POST /api/customers - Create/register a new customer session
router.post('/', async (req: Request, res: Response) => {
  try {
    const customerData = CreateCustomerSchema.parse(req.body);
    
    const customer: Customer = {
      id: crypto.randomUUID(),
      name: customerData.name,
      ...(customerData.email && { email: customerData.email }),
      ...(customerData.phone && { phone: customerData.phone }),
      sessionId: crypto.randomUUID(),
      ...(customerData.tableNumber && { tableNumber: customerData.tableNumber }),
      preferences: {
        dietaryRestrictions: customerData.preferences?.dietaryRestrictions || [],
        allergies: customerData.preferences?.allergies || [],
        spiceLevel: customerData.preferences?.spiceLevel || 'medium',
        ...(customerData.preferences?.favoriteItems && { favoriteItems: customerData.preferences.favoriteItems })
      },
      createdAt: new Date(),
      lastActiveAt: new Date()
    };

    // Validate the created customer
    CustomerValidator.validate(customer);

    // Store in mock storage (will be database in production)
    mockCustomers.set(customer.id, customer);

    // Store session in Redis-like cache
    await session.set(
      `customer_session:${customer.sessionId}`,
      JSON.stringify({ customerId: customer.id }),
      14400 // 4 hours TTL
    );

    res.status(201).json({
      success: true,
      data: {
        id: customer.id,
        sessionId: customer.sessionId,
        tableNumber: customer.tableNumber,
        preferences: customer.preferences,
        createdAt: customer.createdAt
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid customer data',
        details: error.errors
      });
    } else {
      console.error('Customer creation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create customer session'
      });
    }
  }
});

// GET /api/customers/:id - Get customer details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }
    
    const customer = mockCustomers.get(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Check if session is still active
    const isActive = CustomerValidator.isActiveSession(customer);
    
    return res.json({
      success: true,
      data: {
        id: customer.id,
        sessionId: customer.sessionId,
        tableNumber: customer.tableNumber,
        preferences: customer.preferences,
        createdAt: customer.createdAt,
        lastActiveAt: customer.lastActiveAt,
        isActiveSession: isActive
      }
    });

  } catch (error) {
    console.error('Customer fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch customer'
    });
  }
});

// PUT /api/customers/:id - Update customer preferences
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }
    
    const updateData = UpdateCustomerSchema.parse(req.body);
    
    const customer = mockCustomers.get(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Check if session is still active
    if (!CustomerValidator.isActiveSession(customer)) {
      return res.status(410).json({
        success: false,
        error: 'Customer session has expired'
      });
    }

    // Update customer data
    const updatedCustomer: Customer = {
      ...customer,
      ...(updateData.name && { name: updateData.name }),
      ...(updateData.email && { email: updateData.email }),
      ...(updateData.phone && { phone: updateData.phone }),
      ...(updateData.tableNumber && { tableNumber: updateData.tableNumber }),
      preferences: {
        dietaryRestrictions: updateData.preferences?.dietaryRestrictions || customer.preferences.dietaryRestrictions,
        allergies: updateData.preferences?.allergies || customer.preferences.allergies,
        spiceLevel: updateData.preferences?.spiceLevel || customer.preferences.spiceLevel,
        ...(updateData.preferences?.favoriteItems && { favoriteItems: updateData.preferences.favoriteItems })
      },
      lastActiveAt: new Date()
    };

    // Validate updated customer
    CustomerValidator.validate(updatedCustomer);

    // Update in storage
    mockCustomers.set(id, updatedCustomer);

    return res.json({
      success: true,
      data: {
        id: updatedCustomer.id,
        sessionId: updatedCustomer.sessionId,
        tableNumber: updatedCustomer.tableNumber,
        preferences: updatedCustomer.preferences,
        lastActiveAt: updatedCustomer.lastActiveAt
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        details: error.errors
      });
    } else {
      console.error('Customer update error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update customer'
      });
    }
  }
});

// POST /api/customers/:id/activity - Update last active timestamp
router.post('/:id/activity', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }
    
    const customer = mockCustomers.get(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Update last active timestamp
    const updatedCustomer: Customer = {
      ...customer,
      lastActiveAt: new Date()
    };

    mockCustomers.set(id, updatedCustomer);

    return res.json({
      success: true,
      data: {
        customerId: id,
        lastActiveAt: updatedCustomer.lastActiveAt,
        isActiveSession: CustomerValidator.isActiveSession(updatedCustomer)
      }
    });

  } catch (error) {
    console.error('Customer activity update error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update customer activity'
    });
  }
});

// GET /api/customers/session/:sessionId - Get customer by session ID
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }
    
    // Check session in cache
    const sessionData = await session.get(`customer_session:${sessionId}`);
    
    if (!sessionData) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired'
      });
    }

    const { customerId } = JSON.parse(sessionData);
    const customer = mockCustomers.get(customerId);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Check if session is still active
    const isActive = CustomerValidator.isActiveSession(customer);
    
    if (!isActive) {
      // Clean up expired session
      await session.del(`customer_session:${sessionId}`);
      return res.status(410).json({
        success: false,
        error: 'Session has expired'
      });
    }

    return res.json({
      success: true,
      data: {
        id: customer.id,
        sessionId: customer.sessionId,
        tableNumber: customer.tableNumber,
        preferences: customer.preferences,
        createdAt: customer.createdAt,
        lastActiveAt: customer.lastActiveAt,
        isActiveSession: true
      }
    });

  } catch (error) {
    console.error('Session lookup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to lookup session'
    });
  }
});

// DELETE /api/customers/:id/session - End customer session
router.delete('/:id/session', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }
    
    const customer = mockCustomers.get(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Remove from session cache
    await session.del(`customer_session:${customer.sessionId}`);

    // Remove from mock storage (in production, might just mark as inactive)
    mockCustomers.delete(id);

    return res.json({
      success: true,
      message: 'Customer session ended successfully'
    });

  } catch (error) {
    console.error('Session end error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to end session'
    });
  }
});

export default router;