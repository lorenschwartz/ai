import { z } from 'zod';

// Table status enum
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'unavailable';

// Table interface
export interface Table {
  id: string;                    // UUID
  restaurantId: string;          // Foreign key to restaurant
  tableNumber: string;           // Display name (e.g., "T1", "Booth 3")
  capacity: number;              // Number of seats
  location?: string;             // Description of location (e.g., "by window", "patio")
  status: TableStatus;
  qrCodeUrl?: string;            // QR code for customers to scan
  isActive: boolean;             // Whether table is active in the system
  createdAt: Date;
  updatedAt: Date;
}

// Validation schema
const TABLE_STATUS = ['available', 'occupied', 'reserved', 'unavailable'] as const;

export const TableSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  tableNumber: z.string().min(1).max(20),
  capacity: z.number().int().positive().max(50),
  location: z.string().max(100).optional(),
  status: z.enum(TABLE_STATUS),
  qrCodeUrl: z.string().url().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TableInput = z.infer<typeof TableSchema>;

// Create/Update schema (without id and timestamps)
export const CreateTableSchema = z.object({
  restaurantId: z.string().uuid(),
  tableNumber: z.string().min(1).max(20),
  capacity: z.number().int().positive().max(50),
  location: z.string().max(100).optional(),
  status: z.enum(TABLE_STATUS).optional().default('available'),
  qrCodeUrl: z.string().url().optional(),
  isActive: z.boolean().optional().default(true)
});

export const UpdateTableSchema = z.object({
  tableNumber: z.string().min(1).max(20).optional(),
  capacity: z.number().int().positive().max(50).optional(),
  location: z.string().max(100).optional(),
  status: z.enum(TABLE_STATUS).optional(),
  qrCodeUrl: z.string().url().optional(),
  isActive: z.boolean().optional()
});

export type CreateTableInput = z.infer<typeof CreateTableSchema>;
export type UpdateTableInput = z.infer<typeof UpdateTableSchema>;

// Helper functions for Table operations
export class TableValidator {
  static validate(table: unknown): TableInput {
    return TableSchema.parse(table);
  }

  static validateCreate(data: unknown): CreateTableInput {
    return CreateTableSchema.parse(data);
  }

  static validateUpdate(data: unknown): UpdateTableInput {
    return UpdateTableSchema.parse(data);
  }

  static isAvailable(table: Table): boolean {
    return table.isActive && table.status === 'available';
  }

  static canAccommodate(table: Table, partySize: number): boolean {
    return table.capacity >= partySize && this.isAvailable(table);
  }
}
