import { z } from 'zod';

// Special Instruction types
export type InstructionType = 'kitchen' | 'service' | 'dietary' | 'promotional' | 'general';
export type InstructionPriority = 'low' | 'medium' | 'high' | 'critical';

// Special Instruction interface (chef/owner notes)
export interface SpecialInstruction {
  id: string;                    // UUID
  restaurantId: string;          // Foreign key to restaurant
  title: string;                 // Short title
  content: string;               // Full instruction content
  type: InstructionType;         // Category of instruction
  priority: InstructionPriority; // Priority level
  isActive: boolean;             // Whether instruction is currently active
  showToAI: boolean;             // Whether AI should consider this instruction
  validFrom?: Date;              // Start date for time-limited instructions
  validUntil?: Date;             // End date for time-limited instructions
  createdBy?: string;            // User who created the instruction
  createdAt: Date;
  updatedAt: Date;
}

// Validation schema
const INSTRUCTION_TYPES = ['kitchen', 'service', 'dietary', 'promotional', 'general'] as const;
const INSTRUCTION_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

export const SpecialInstructionSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(2000),
  type: z.enum(INSTRUCTION_TYPES),
  priority: z.enum(INSTRUCTION_PRIORITIES),
  isActive: z.boolean(),
  showToAI: z.boolean(),
  validFrom: z.date().optional(),
  validUntil: z.date().optional(),
  createdBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type SpecialInstructionInput = z.infer<typeof SpecialInstructionSchema>;

// Create/Update schema (without id and timestamps)
export const CreateSpecialInstructionSchema = z.object({
  restaurantId: z.string().uuid(),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(2000),
  type: z.enum(INSTRUCTION_TYPES),
  priority: z.enum(INSTRUCTION_PRIORITIES).optional().default('medium'),
  isActive: z.boolean().optional().default(true),
  showToAI: z.boolean().optional().default(true),
  validFrom: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  validUntil: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  createdBy: z.string().optional()
});

export const UpdateSpecialInstructionSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(2000).optional(),
  type: z.enum(INSTRUCTION_TYPES).optional(),
  priority: z.enum(INSTRUCTION_PRIORITIES).optional(),
  isActive: z.boolean().optional(),
  showToAI: z.boolean().optional(),
  validFrom: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  validUntil: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined)
});

export type CreateSpecialInstructionInput = z.infer<typeof CreateSpecialInstructionSchema>;
export type UpdateSpecialInstructionInput = z.infer<typeof UpdateSpecialInstructionSchema>;

// Helper functions for SpecialInstruction operations
export class SpecialInstructionValidator {
  static validate(instruction: unknown): SpecialInstructionInput {
    return SpecialInstructionSchema.parse(instruction);
  }

  static validateCreate(data: unknown): CreateSpecialInstructionInput {
    return CreateSpecialInstructionSchema.parse(data);
  }

  static validateUpdate(data: unknown): UpdateSpecialInstructionInput {
    return UpdateSpecialInstructionSchema.parse(data);
  }

  static isCurrentlyValid(instruction: SpecialInstruction): boolean {
    if (!instruction.isActive) return false;
    
    const now = new Date();
    
    if (instruction.validFrom && now < instruction.validFrom) {
      return false;
    }
    
    if (instruction.validUntil && now > instruction.validUntil) {
      return false;
    }
    
    return true;
  }

  static getActiveInstructionsForAI(instructions: SpecialInstruction[]): SpecialInstruction[] {
    return instructions
      .filter(i => i.showToAI && this.isCurrentlyValid(i))
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }
}
