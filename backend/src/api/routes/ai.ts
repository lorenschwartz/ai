import { Router, Request, Response } from 'express';
import { aiService } from '../../services/AIService';
import { z } from 'zod';

const router = Router();

// Request schema for AI chat testing
const AITestSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    customerPreferences: z.object({
      dietary: z.array(z.string()).optional(),
      allergies: z.array(z.string()).optional(),
      spiceLevel: z.number().min(1).max(5).optional()
    }).optional(),
    menuContext: z.array(z.string()).optional(),
    conversationHistory: z.array(z.object({
      role: z.enum(['customer', 'ai']),
      content: z.string()
    })).optional()
  }).optional()
});

// POST /api/ai/chat - Test AI chat functionality
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const testData = AITestSchema.parse(req.body);
    
    // Build AI context from request
    const aiContext = {
      ...(testData.context?.customerPreferences && {
        customer: {
          id: 'test-customer',
          name: 'Test Customer',
          sessionId: 'test-session',
          preferences: {
            dietaryRestrictions: testData.context.customerPreferences.dietary || [],
            allergies: testData.context.customerPreferences.allergies || [],
            spiceLevel: testData.context.customerPreferences.spiceLevel === 1 ? 'mild' : 
                       testData.context.customerPreferences.spiceLevel === 2 ? 'mild' :
                       testData.context.customerPreferences.spiceLevel === 3 ? 'medium' :
                       testData.context.customerPreferences.spiceLevel === 4 ? 'hot' : 'extra-hot',
          },
          createdAt: new Date(),
          lastActiveAt: new Date()
        }
      }),
      ...(testData.context?.conversationHistory && {
        previousMessages: testData.context.conversationHistory.map((msg, index) => ({
          id: `test-msg-${index}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date()
        }))
      }),
      restaurantInfo: {
        name: process.env.RESTAURANT_NAME || 'AI-Mi Restaurant',
        description: process.env.RESTAURANT_DESCRIPTION || 'A modern dining experience with AI-powered service',
        specialties: ['Contemporary cuisine', 'Fresh ingredients', 'Innovative presentation'],
        hours: process.env.RESTAURANT_HOURS || '11:00 AM - 10:00 PM daily'
      }
    };

    // Generate AI response
    const aiResponse = await aiService.generateResponse(testData.message, aiContext as any);
    
    return res.json({
      success: true,
      data: {
        userMessage: testData.message,
        aiResponse: aiResponse.message,
        metadata: {
          confidence: aiResponse.confidence,
          intent: aiResponse.intent,
          suggestedMenuItems: aiResponse.suggestedMenuItems,
          needsHumanIntervention: aiResponse.needsHumanIntervention
        },
        context: aiContext
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
    }
    
    console.error('AI Chat Test Error:', error);
    return res.status(500).json({
      success: false,
      error: 'AI chat test failed'
    });
  }
});

// GET /api/ai/health - Check AI service health
router.get('/health', async (req: Request, res: Response) => {
  try {
    const isHealthy = await aiService.healthCheck();
    
    return res.json({
      success: true,
      data: {
        status: isHealthy ? 'healthy' : 'mock_mode',
        timestamp: new Date().toISOString(),
        service: 'OpenAI',
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'
      }
    });
    
  } catch (error) {
    console.error('AI Health Check Error:', error);
    return res.status(500).json({
      success: false,
      error: 'AI health check failed'
    });
  }
});

// POST /api/ai/test-scenarios - Test common restaurant scenarios
router.post('/test-scenarios', async (req: Request, res: Response) => {
  try {
    const scenarios = [
      {
        name: 'Menu Inquiry',
        message: 'What do you recommend for someone who loves seafood?',
        context: {
          customerPreferences: {
            dietary: ['gluten-free'],
            spiceLevel: 2
          }
        }
      },
      {
        name: 'Order Intent',
        message: 'I\'d like to order the salmon please',
        context: {}
      },
      {
        name: 'Dietary Restriction',
        message: 'Do you have any vegan options?',
        context: {
          customerPreferences: {
            dietary: ['vegan']
          }
        }
      },
      {
        name: 'General Inquiry',
        message: 'What time do you close?',
        context: {}
      }
    ];

    const results = [];
    
    for (const scenario of scenarios) {
      try {
        const aiContext = {
          ...(scenario.context.customerPreferences && {
            customer: {
              id: 'test-customer',
              name: 'Test Customer',
              sessionId: 'test-session',
              preferences: {
                dietaryRestrictions: scenario.context.customerPreferences.dietary || [],
                allergies: [],
                spiceLevel: scenario.context.customerPreferences.spiceLevel === 1 ? 'mild' : 
                           scenario.context.customerPreferences.spiceLevel === 2 ? 'mild' :
                           scenario.context.customerPreferences.spiceLevel === 3 ? 'medium' :
                           scenario.context.customerPreferences.spiceLevel === 4 ? 'hot' : 'extra-hot',
              },
              createdAt: new Date(),
              lastActiveAt: new Date()
            }
          }),
          restaurantInfo: {
            name: 'AI-Mi Restaurant',
            description: 'A modern dining experience with AI-powered service',
            specialties: ['Contemporary cuisine', 'Fresh ingredients', 'Innovative presentation'],
            hours: '11:00 AM - 10:00 PM daily'
          }
        };

        const response = await aiService.generateResponse(scenario.message, aiContext as any);
        
        results.push({
          scenario: scenario.name,
          input: scenario.message,
          output: response.message,
          metadata: {
            confidence: response.confidence,
            intent: response.intent,
            needsHumanIntervention: response.needsHumanIntervention
          }
        });
        
      } catch (scenarioError) {
        results.push({
          scenario: scenario.name,
          input: scenario.message,
          error: 'Failed to generate response'
        });
      }
    }
    
    return res.json({
      success: true,
      data: {
        totalScenarios: scenarios.length,
        results
      }
    });
    
  } catch (error) {
    console.error('AI Test Scenarios Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Test scenarios failed'
    });
  }
});

export default router;