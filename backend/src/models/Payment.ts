import { PaymentMethod, PaymentStatus } from './types';
import { z } from 'zod';

export interface PaymentSplit {
  customerId: string;
  amount: number;                // In cents
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
}

export interface Payment {
  id: string;                    // UUID
  orderId: string;               // Foreign key
  customerId: string;            // Foreign key
  amount: number;                // In cents
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string; // External payment processor reference
  splits?: PaymentSplit[];       // For split payments
  receipt: {
    receiptId: string;
    emailSent: boolean;
    downloadUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Validation schemas
export const PaymentSplitSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().int().positive(),
  method: z.nativeEnum(PaymentMethod),
  status: z.nativeEnum(PaymentStatus),
  stripePaymentIntentId: z.string().optional()
});

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  customerId: z.string().uuid(),
  amount: z.number().int().positive(),
  method: z.nativeEnum(PaymentMethod),
  status: z.nativeEnum(PaymentStatus),
  stripePaymentIntentId: z.string().optional(),
  splits: z.array(PaymentSplitSchema).optional(),
  receipt: z.object({
    receiptId: z.string().uuid(),
    emailSent: z.boolean(),
    downloadUrl: z.string().url().optional()
  }),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type PaymentInput = z.infer<typeof PaymentSchema>;
export type PaymentSplitInput = z.infer<typeof PaymentSplitSchema>;

// Helper functions for Payment operations
export class PaymentValidator {
  static validate(payment: unknown): PaymentInput {
    return PaymentSchema.parse(payment);
  }

  static validateSplit(split: unknown): PaymentSplitInput {
    return PaymentSplitSchema.parse(split);
  }

  static validateSplitAmounts(payment: Payment): boolean {
    if (!payment.splits || payment.splits.length === 0) {
      return true; // No splits to validate
    }

    const totalSplitAmount = payment.splits.reduce((total, split) => total + split.amount, 0);
    return totalSplitAmount === payment.amount;
  }

  static canTransitionStatus(from: PaymentStatus, to: PaymentStatus): boolean {
    const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      [PaymentStatus.PENDING]: [PaymentStatus.PROCESSING, PaymentStatus.FAILED],
      [PaymentStatus.PROCESSING]: [PaymentStatus.COMPLETED, PaymentStatus.FAILED],
      [PaymentStatus.COMPLETED]: [PaymentStatus.REFUNDED],
      [PaymentStatus.FAILED]: [PaymentStatus.PENDING], // Can retry
      [PaymentStatus.REFUNDED]: [] // Terminal state
    };

    return validTransitions[from]?.includes(to) || false;
  }

  static isCompleted(payment: Payment): boolean {
    return payment.status === PaymentStatus.COMPLETED;
  }

  static isFailed(payment: Payment): boolean {
    return payment.status === PaymentStatus.FAILED;
  }

  static requiresExternalProcessor(method: PaymentMethod): boolean {
    return method !== PaymentMethod.CASH;
  }

  static calculateAmountInDollars(payment: Payment): number {
    return payment.amount / 100;
  }

  static createReceiptId(): string {
    return crypto.randomUUID();
  }
}