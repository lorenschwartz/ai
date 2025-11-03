import { DietaryTag, Allergen } from './types';

export interface Customer {
  id: string;                    // UUID
  sessionId: string;             // Current dining session
  tableNumber?: string;          // Physical table identifier
  preferences: {
    dietary: DietaryTag[];       // ["vegetarian", "gluten-free", "dairy-free"]
    allergies: Allergen[];       // ["nuts", "shellfish", "eggs"] 
    spiceLevel: number;          // 1-5 scale
    previousOrders?: string[];   // Historical order IDs for recommendations
  };
  createdAt: Date;
  lastActiveAt: Date;
}

// Validation schema for Customer using Zod
import { z } from 'zod';
import { DIETARY_TAGS, ALLERGENS } from './types';

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().min(1),
  tableNumber: z.string().optional(),
  preferences: z.object({
    dietary: z.array(z.enum(DIETARY_TAGS)),
    allergies: z.array(z.enum(ALLERGENS)),
    spiceLevel: z.number().int().min(1).max(5),
    previousOrders: z.array(z.string().uuid()).optional()
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