import { PaymentMethod } from './types';
import { z } from 'zod';

export interface Restaurant {
  id: string;                    // UUID
  name: string;
  settings: {
    businessHours: {
      [day: string]: {           // "monday", "tuesday", etc.
        open: string;            // "09:00"
        close: string;           // "22:00"
        isOpen: boolean;
      };
    };
    paymentMethods: PaymentMethod[];
    taxRate: number;             // Decimal (e.g., 0.08 for 8%)
    tipSuggestions: number[];    // [15, 18, 20, 25] percentages
    posIntegration: {
      provider: string;          // "toast", "square", "lightspeed"
      apiKey: string;            // Encrypted
      webhookUrl: string;
    };
  };
  branding: {
    tone: string;                // "friendly", "formal", "casual"
    welcomeMessage: string;
    logoUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Validation schema
const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const TONE_OPTIONS = ["friendly", "formal", "casual"] as const;
const POS_PROVIDERS = ["toast", "square", "lightspeed", "custom"] as const;

export const RestaurantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  settings: z.object({
    businessHours: z.record(
      z.enum(DAYS_OF_WEEK),
      z.object({
        open: z.string().regex(TIME_REGEX),
        close: z.string().regex(TIME_REGEX),
        isOpen: z.boolean()
      })
    ),
    paymentMethods: z.array(z.nativeEnum(PaymentMethod)).min(1),
    taxRate: z.number().min(0).max(1),
    tipSuggestions: z.array(z.number().int().positive().max(100)).min(1),
    posIntegration: z.object({
      provider: z.enum(POS_PROVIDERS),
      apiKey: z.string().min(1),
      webhookUrl: z.string().url()
    })
  }),
  branding: z.object({
    tone: z.enum(TONE_OPTIONS),
    welcomeMessage: z.string().min(1).max(500),
    logoUrl: z.string().url().optional()
  }),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type RestaurantInput = z.infer<typeof RestaurantSchema>;

// Helper functions for Restaurant operations
export class RestaurantValidator {
  static validate(restaurant: unknown): RestaurantInput {
    return RestaurantSchema.parse(restaurant);
  }

  static isOpenNow(restaurant: Restaurant): boolean {
    const now = new Date();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayName = dayNames[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    
    if (!dayName) return false;
    
    const todayHours = restaurant.settings.businessHours[dayName];
    if (!todayHours || !todayHours.isOpen) {
      return false;
    }

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  }

  static supportsPaymentMethod(restaurant: Restaurant, method: PaymentMethod): boolean {
    return restaurant.settings.paymentMethods.includes(method);
  }

  static calculateTax(restaurant: Restaurant, amount: number): number {
    return Math.round(amount * restaurant.settings.taxRate);
  }

  static calculateTip(restaurant: Restaurant, amount: number, tipPercentage: number): number {
    if (!restaurant.settings.tipSuggestions.includes(tipPercentage)) {
      throw new Error(`Invalid tip percentage: ${tipPercentage}%. Supported: ${restaurant.settings.tipSuggestions.join(', ')}%`);
    }
    return Math.round(amount * (tipPercentage / 100));
  }

  static getBusinessHoursForDay(restaurant: Restaurant, day: string): { open: string; close: string; isOpen: boolean } | null {
    const dayLower = day.toLowerCase();
    return restaurant.settings.businessHours[dayLower] || null;
  }

  static isValidBusinessHours(open: string, close: string): boolean {
    if (!TIME_REGEX.test(open) || !TIME_REGEX.test(close)) {
      return false;
    }

    const openParts = open.split(':').map(Number);
    const closeParts = close.split(':').map(Number);
    
    if (openParts.length !== 2 || closeParts.length !== 2) {
      return false;
    }
    
    const openMinutes = openParts[0]! * 60 + openParts[1]!;
    const closeMinutes = closeParts[0]! * 60 + closeParts[1]!;
    
    return openMinutes < closeMinutes;
  }
}