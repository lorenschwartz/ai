import { ConversationRole, ConversationTopic, CustomerIntent, DietaryTag } from './types';
import { z } from 'zod';

export interface ConversationMessage {
  id: string;
  role: ConversationRole;
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;         // AI confidence score
    intent?: string;            // Detected customer intent
    entities?: Record<string, any>; // Extracted entities (items, quantities)
  };
}

export interface Conversation {
  id: string;                    // UUID
  customerId: string;            // Foreign key
  sessionId: string;             // Links to customer session
  currentOrderId?: string;       // Foreign key to active order
  context: {
    currentTopic: ConversationTopic; // "menu_exploration", "ordering", "payment"
    lastMenuCategory?: string;   // For context continuity
    discussedItems: string[];    // MenuItem IDs mentioned
    customerIntent: CustomerIntent; // "browsing", "ordering", "asking_question"
    preferences: {               // Session-specific preferences
      dietary?: DietaryTag[];
      priceRange?: { min: number; max: number; };
      coursePreference?: string; // "appetizer", "main", "dessert"
    };
  };
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;              // Auto-cleanup inactive conversations
}

// Validation schemas
const CONVERSATION_ROLES = ["customer", "ai", "staff"] as const;
const CONVERSATION_TOPICS = ["menu_exploration", "ordering", "payment", "feedback", "greeting"] as const;
const CUSTOMER_INTENTS = ["browsing", "ordering", "asking_question"] as const;

export const ConversationMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(CONVERSATION_ROLES),
  content: z.string().min(1).max(2000),
  timestamp: z.date(),
  metadata: z.object({
    confidence: z.number().min(0).max(1).optional(),
    intent: z.string().optional(),
    entities: z.record(z.any()).optional()
  }).optional()
});

export const ConversationSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  sessionId: z.string().min(1),
  currentOrderId: z.string().uuid().optional(),
  context: z.object({
    currentTopic: z.enum(CONVERSATION_TOPICS),
    lastMenuCategory: z.string().optional(),
    discussedItems: z.array(z.string().uuid()),
    customerIntent: z.enum(CUSTOMER_INTENTS),
    preferences: z.object({
      dietary: z.array(z.string()).optional(),
      priceRange: z.object({
        min: z.number().nonnegative(),
        max: z.number().positive()
      }).optional(),
      coursePreference: z.string().optional()
    })
  }),
  messages: z.array(ConversationMessageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date()
});

export type ConversationInput = z.infer<typeof ConversationSchema>;
export type ConversationMessageInput = z.infer<typeof ConversationMessageSchema>;

// Helper functions for Conversation operations
export class ConversationValidator {
  static validate(conversation: unknown): ConversationInput {
    return ConversationSchema.parse(conversation);
  }

  static validateMessage(message: unknown): ConversationMessageInput {
    return ConversationMessageSchema.parse(message);
  }

  static isExpired(conversation: Conversation): boolean {
    return new Date() > conversation.expiresAt;
  }

  static getLastMessage(conversation: Conversation): ConversationMessage | undefined {
    return conversation.messages[conversation.messages.length - 1];
  }

  static getLastCustomerMessage(conversation: Conversation): ConversationMessage | undefined {
    return conversation.messages
      .filter(msg => msg.role === 'customer')
      .pop();
  }

  static addMessage(conversation: Conversation, message: Omit<ConversationMessage, 'id' | 'timestamp'>): Conversation {
    const newMessage: ConversationMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    return {
      ...conversation,
      messages: [...conversation.messages, newMessage],
      updatedAt: new Date()
    };
  }

  static updateContext(conversation: Conversation, contextUpdate: Partial<Conversation['context']>): Conversation {
    return {
      ...conversation,
      context: {
        ...conversation.context,
        ...contextUpdate
      },
      updatedAt: new Date()
    };
  }

  static createExpirationTime(): Date {
    const fourHoursFromNow = new Date();
    fourHoursFromNow.setHours(fourHoursFromNow.getHours() + 4);
    return fourHoursFromNow;
  }
}