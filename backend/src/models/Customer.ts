import { DietaryTag, Allergen } from './types';

export interface Customer {
  id: string;                    // UUID
  name: string;                  // Customer name
  email?: string;                // Customer email
  phone?: string;                // Customer phone
  sessionId: string;             // Current dining session
  tableNumber?: string;          // Physical table identifier
  preferences: {
    dietaryRestrictions: string[];  // ["vegetarian", "gluten-free", "dairy-free"]
    allergies: string[];            // ["nuts", "shellfish", "eggs"] 
    spiceLevel: 'mild' | 'medium' | 'hot' | 'extra-hot';  // Spice preference
    favoriteItems?: string[];       // Favorite menu items
  };
  createdAt: Date;
  lastActiveAt: Date;
}

// Validation schema for Customer using Zod
import { z } from 'zod';
import { DIETARY_TAGS, ALLERGENS } from './types';

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  sessionId: z.string().min(1),
  tableNumber: z.string().optional(),
  preferences: z.object({
    dietaryRestrictions: z.array(z.string()),
    allergies: z.array(z.string()),
    spiceLevel: z.enum(['mild', 'medium', 'hot', 'extra-hot']),
    favoriteItems: z.array(z.string()).optional()
  }),
  createdAt: z.date(),
  lastActiveAt: z.date()
});

export type CustomerInput = z.infer<typeof CustomerSchema>;

// Helper functions for Customer operations
export class CustomerValidator {
  static validate(customer: unknown): CustomerInput {
    return CustomerSchema.parse(customer);
  }

  static isValidSpiceLevel(level: number): boolean {
    return Number.isInteger(level) && level >= 1 && level <= 5;
  }

  static isActiveSession(customer: Customer): boolean {
    const hoursSinceActive = (Date.now() - customer.lastActiveAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceActive < 4; // 4 hour session timeout
  }
}