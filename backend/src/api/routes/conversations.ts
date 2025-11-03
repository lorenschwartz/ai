import { Router, Request, Response } from 'express';
import { Conversation, ConversationValidator } from '../../models/Conversation';
import { CustomerValidator } from '../../models/Customer';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

// Request schemas
const CreateConversationSchema = z.object({
  customerId: z.string().uuid(),
  sessionId: z.string().min(1),
  currentOrderId: z.string().uuid().optional(),
  initialMessage: z.string().min(1).optional()
});

const AddMessageSchema = z.object({
  role: z.enum(['customer', 'ai', 'staff']),
  content: z.string().min(1).max(2000),
  metadata: z.object({
    intent: z.string().optional(),
    confidence: z.number().min(0).max(1).optional(),
    entities: z.record(z.any()).optional()
  }).optional()
});

const UpdateContextSchema = z.object({
  currentTopic: z.enum(['menu_exploration', 'ordering', 'payment', 'feedback', 'greeting']).optional(),
  lastMenuCategory: z.string().optional(),
  discussedItems: z.array(z.string().uuid()).optional(),
  customerIntent: z.enum(['browsing', 'ordering', 'asking_question']).optional(),
  preferences: z.object({
    dietary: z.array(z.string()).optional(),
    priceRange: z.object({
      min: z.number().nonnegative(),
      max: z.number().positive()
    }).optional(),
    coursePreference: z.string().optional()
  }).optional()
});

// Mock storage for development
const mockConversations = new Map<string, Conversation>();
const mockCustomers = new Map<string, any>(); // Reference to customer data

// POST /api/conversations - Start a new conversation
router.post('/', async (req: Request, res: Response) => {
  try {
    const conversationData = CreateConversationSchema.parse(req.body);
    
    // Mock customer verification (in production, fetch from database)
    if (!mockCustomers.has(conversationData.customerId)) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    const conversation: Conversation = {
      id: crypto.randomUUID(),
      customerId: conversationData.customerId,
      sessionId: conversationData.sessionId,
      ...(conversationData.currentOrderId && { currentOrderId: conversationData.currentOrderId }),
      messages: [],
      context: {
        currentTopic: 'greeting',
        discussedItems: [],
        customerIntent: 'browsing',
        preferences: {}
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
    };

    // Add initial messages if provided
    if (conversationData.initialMessage) {
      const messageWithCustomer = ConversationValidator.addMessage(conversation, {
        role: 'customer',
        content: conversationData.initialMessage,
        metadata: {
          intent: 'initial_greeting',
          confidence: 1.0
        }
      });

      const messageWithAI = ConversationValidator.addMessage(messageWithCustomer, {
        role: 'ai',
        content: 'Hello! Welcome to our restaurant. I\'m your AI waiter and I\'m here to help you with your order. How can I assist you today?',
        metadata: {
          intent: 'greeting_response',
          confidence: 1.0
        }
      });

      mockConversations.set(messageWithAI.id, messageWithAI);

      return res.status(201).json({
        success: true,
        data: {
          id: messageWithAI.id,
          customerId: messageWithAI.customerId,
          currentOrderId: messageWithAI.currentOrderId,
          messages: messageWithAI.messages,
          context: messageWithAI.context,
          createdAt: messageWithAI.createdAt,
          expiresAt: messageWithAI.expiresAt
        }
      });
    }

    mockConversations.set(conversation.id, conversation);

    return res.status(201).json({
      success: true,
      data: {
        id: conversation.id,
        customerId: conversation.customerId,
        currentOrderId: conversation.currentOrderId,
        messages: conversation.messages,
        context: conversation.context,
        createdAt: conversation.createdAt,
        expiresAt: conversation.expiresAt
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid conversation data',
        details: error.errors
      });
    }
    console.error('Conversation creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// GET /api/conversations/:id - Get conversation details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }
    
    const conversation = mockConversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    if (ConversationValidator.isExpired(conversation)) {
      return res.status(410).json({
        success: false,
        error: 'Conversation has expired'
      });
    }

    return res.json({
      success: true,
      data: {
        id: conversation.id,
        customerId: conversation.customerId,
        currentOrderId: conversation.currentOrderId,
        messages: conversation.messages,
        context: conversation.context,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        expiresAt: conversation.expiresAt,
        isExpired: ConversationValidator.isExpired(conversation)
      }
    });

  } catch (error) {
    console.error('Conversation fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation'
    });
  }
});

// POST /api/conversations/:id/messages - Add a message to conversation
router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }
    
    const messageData = AddMessageSchema.parse(req.body);
    const conversation = mockConversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    if (ConversationValidator.isExpired(conversation)) {
      return res.status(410).json({
        success: false,
        error: 'Conversation has expired'
      });
    }

    const updatedConversation = ConversationValidator.addMessage(conversation, {
      role: messageData.role,
      content: messageData.content,
      ...(messageData.metadata && { 
        metadata: {
          ...(messageData.metadata.confidence !== undefined && { confidence: messageData.metadata.confidence }),
          ...(messageData.metadata.intent && { intent: messageData.metadata.intent }),
          ...(messageData.metadata.entities && { entities: messageData.metadata.entities })
        }
      })
    });

    mockConversations.set(id, updatedConversation);
    const addedMessage = ConversationValidator.getLastMessage(updatedConversation);

    return res.json({
      success: true,
      data: {
        conversationId: id,
        message: addedMessage,
        totalMessages: updatedConversation.messages.length
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message data',
        details: error.errors
      });
    }
    console.error('Message addition error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add message'
    });
  }
});

// GET /api/conversations/:id/messages - Get conversation messages
router.get('/:id/messages', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = '50', offset = '0' } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }
    
    const conversation = mockConversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);
    const messages = conversation.messages.slice(offsetNum, offsetNum + limitNum);

    return res.json({
      success: true,
      data: {
        conversationId: id,
        messages,
        totalMessages: conversation.messages.length,
        hasMore: offsetNum + limitNum < conversation.messages.length
      }
    });

  } catch (error) {
    console.error('Messages fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

// PUT /api/conversations/:id/context - Update conversation context
router.put('/:id/context', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }
    
    const contextData = UpdateContextSchema.parse(req.body);
    const conversation = mockConversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    if (ConversationValidator.isExpired(conversation)) {
      return res.status(410).json({
        success: false,
        error: 'Conversation has expired'
      });
    }

    // For now, we'll return success without complex context updates
    // In production, this would use proper database updates
    const updatedConversation = conversation;
    updatedConversation.updatedAt = new Date();
    mockConversations.set(id, updatedConversation);

    return res.json({
      success: true,
      data: {
        conversationId: id,
        context: updatedConversation.context,
        updatedAt: updatedConversation.updatedAt
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid context data',
        details: error.errors
      });
    }
    console.error('Context update error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update context'
    });
  }
});

// GET /api/conversations/customer/:customerId - Get customer's conversations
router.get('/customer/:customerId', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const { active = 'true' } = req.query;
    
    if (!customerId) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required'
      });
    }
    
    const activeOnly = active === 'true';
    
    const customerConversations = Array.from(mockConversations.values())
      .filter(conv => conv.customerId === customerId)
      .filter(conv => !activeOnly || !ConversationValidator.isExpired(conv))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return res.json({
      success: true,
      data: {
        customerId,
        conversations: customerConversations.map(conv => ({
          id: conv.id,
          currentOrderId: conv.currentOrderId,
          messageCount: conv.messages.length,
          lastMessage: ConversationValidator.getLastMessage(conv),
          context: conv.context,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          expiresAt: conv.expiresAt,
          isExpired: ConversationValidator.isExpired(conv)
        })),
        total: customerConversations.length
      }
    });

  } catch (error) {
    console.error('Customer conversations fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch customer conversations'
    });
  }
});

// DELETE /api/conversations/:id - End/delete a conversation
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
    }
    
    const conversation = mockConversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    mockConversations.delete(id);

    return res.json({
      success: true,
      message: 'Conversation ended successfully'
    });

  } catch (error) {
    console.error('Conversation deletion error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to end conversation'
    });
  }
});

export default router;