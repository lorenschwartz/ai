import { OrderStatus, PaymentStatus } from './types';
import { z } from 'zod';

export interface OrderItem {
  id: string;
  menuItemId: string;            // Foreign key
  quantity: number;
  unitPrice: number;             // In cents, snapshot at order time
  modifications: string[];       // ["no onions", "extra cheese", "medium rare"]
  totalPrice: number;            // quantity * unitPrice + modifications
}

export interface Order {
  id: string;                    // UUID
  customerId: string;            // Foreign key
  restaurantId: string;          // Foreign key
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;           // In cents, calculated
  taxAmount: number;             // In cents
  tipAmount?: number;            // In cents
  specialInstructions?: string;
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Validation schemas
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  menuItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().positive(),
  modifications: z.array(z.string()),
  totalPrice: z.number().int().positive()
});

export const OrderSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1),
  status: z.nativeEnum(OrderStatus),
  totalAmount: z.number().int().positive(),
  taxAmount: z.number().int().nonnegative(),
  tipAmount: z.number().int().nonnegative().optional(),
  specialInstructions: z.string().max(500).optional(),
  estimatedReadyTime: z.date().optional(),
  actualReadyTime: z.date().optional(),
  paymentStatus: z.nativeEnum(PaymentStatus),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type OrderInput = z.infer<typeof OrderSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;

// Helper functions for Order operations
export class OrderValidator {
  static validate(order: unknown): OrderInput {
    return OrderSchema.parse(order);
  }

  static validateItem(orderItem: unknown): OrderItemInput {
    return OrderItemSchema.parse(orderItem);
  }

  static calculateItemTotal(item: OrderItem): number {
    return item.quantity * item.unitPrice;
  }

  static calculateOrderSubtotal(order: Order): number {
    return order.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  static validateOrderTotal(order: Order): boolean {
    const subtotal = this.calculateOrderSubtotal(order);
    return order.totalAmount === subtotal + order.taxAmount + (order.tipAmount || 0);
  }

  static canTransitionStatus(from: OrderStatus, to: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.DRAFT]: [OrderStatus.SUBMITTED, OrderStatus.CANCELLED],
      [OrderStatus.SUBMITTED]: [OrderStatus.ACKNOWLEDGED, OrderStatus.CANCELLED],
      [OrderStatus.ACKNOWLEDGED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.SERVED, OrderStatus.CANCELLED],
      [OrderStatus.SERVED]: [], // Terminal state
      [OrderStatus.CANCELLED]: [] // Terminal state
    };

    return validTransitions[from]?.includes(to) || false;
  }

  static isTerminalStatus(status: OrderStatus): boolean {
    return status === OrderStatus.SERVED || status === OrderStatus.CANCELLED;
  }

  static isDraft(order: Order): boolean {
    return order.status === OrderStatus.DRAFT;
  }

  static isCompleted(order: Order): boolean {
    return order.status === OrderStatus.SERVED;
  }
}