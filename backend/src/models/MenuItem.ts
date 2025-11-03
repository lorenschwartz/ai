import { DietaryTag, Allergen, MenuCategory } from './types';
import { z } from 'zod';
import { DIETARY_TAGS, ALLERGENS } from './types';

export interface MenuItem {
  id: string;                    // UUID
  restaurantId: string;          // Foreign key
  name: string;                  // Display name
  description: string;           // Detailed description for AI
  category: MenuCategory;        // "appetizer", "entree", "dessert", "beverage"
  price: number;                 // In cents for precision
  ingredients: string[];         // For allergy/dietary filtering
  dietaryTags: DietaryTag[];     // ["vegetarian", "vegan", "gluten-free"]
  allergens: Allergen[];         // ["nuts", "dairy", "gluten", "shellfish"]
  spiceLevel?: number;           // 1-5 scale if applicable
  preparationTime: number;       // Minutes
  availability: {
    isAvailable: boolean;
    reason?: string;             // "out of stock", "seasonal", etc.
  };
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  imageUrl?: string;
  popularityScore: number;       // For recommendations (0-100)
  createdAt: Date;
  updatedAt: Date;
}

// Validation schema
const MENU_CATEGORIES = ["appetizer", "entree", "dessert", "beverage"] as const;

export const MenuItemSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: z.enum(MENU_CATEGORIES),
  price: z.number().int().positive(),
  ingredients: z.array(z.string().min(1)),
  dietaryTags: z.array(z.enum(DIETARY_TAGS)),
  allergens: z.array(z.enum(ALLERGENS)),
  spiceLevel: z.number().int().min(1).max(5).optional(),
  preparationTime: z.number().int().positive(),
  availability: z.object({
    isAvailable: z.boolean(),
    reason: z.string().optional()
  }),
  nutritionInfo: z.object({
    calories: z.number().int().nonnegative(),
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fat: z.number().nonnegative()
  }).optional(),
  imageUrl: z.string().url().optional(),
  popularityScore: z.number().int().min(0).max(100),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type MenuItemInput = z.infer<typeof MenuItemSchema>;

// Helper functions for MenuItem operations
export class MenuItemValidator {
  static validate(menuItem: unknown): MenuItemInput {
    return MenuItemSchema.parse(menuItem);
  }

  static isAvailable(menuItem: MenuItem): boolean {
    return menuItem.availability.isAvailable;
  }

  static hasAllergen(menuItem: MenuItem, allergen: Allergen): boolean {
    return menuItem.allergens.includes(allergen);
  }

  static hasDietaryTag(menuItem: MenuItem, tag: DietaryTag): boolean {
    return menuItem.dietaryTags.includes(tag);
  }

  static calculatePriceInDollars(menuItem: MenuItem): number {
    return menuItem.price / 100;
  }

  static matchesAllergies(menuItem: MenuItem, customerAllergies: Allergen[]): boolean {
    return !customerAllergies.some(allergen => menuItem.allergens.includes(allergen));
  }

  static matchesDietaryRequirements(menuItem: MenuItem, dietaryTags: DietaryTag[]): boolean {
    return dietaryTags.every(tag => menuItem.dietaryTags.includes(tag));
  }
}