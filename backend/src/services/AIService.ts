import OpenAI from 'openai';
import { ConversationMessage } from '../models/Conversation';
import { ConversationRole } from '../models/types';
import { Customer } from '../models/Customer';
import { MenuItem } from '../models/MenuItem';

// Types for AI service
export interface AIConversationContext {
  customer?: Customer;
  menuItems?: MenuItem[];
  previousMessages?: ConversationMessage[];
  restaurantInfo?: {
    name: string;
    description: string;
    specialties: string[];
    hours: string;
  };
}

export interface AIResponse {
  message: string;
  confidence: number;
  intent?: 'menu_inquiry' | 'order_intent' | 'general_chat' | 'complaint' | 'special_request';
  suggestedMenuItems?: string[]; // Menu item IDs
  needsHumanIntervention?: boolean;
}

export class AIService {
  private openai: OpenAI;
  private defaultModel: string = 'gpt-4-turbo-preview';
  
  constructor(apiKey?: string) {
    if (!apiKey && !process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OpenAI API key not provided. AI features will be disabled.');
      this.openai = {} as OpenAI; // Mock for development
      return;
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate AI response for restaurant waiter conversations
   */
  async generateResponse(
    userMessage: string,
    context: AIConversationContext = {}
  ): Promise<AIResponse> {
    try {
      if (!this.openai.chat) {
        // Return mock response for development
        return this.getMockResponse(userMessage, context);
      }

      const systemPrompt = this.buildSystemPrompt(context);
      const conversationHistory = this.buildConversationHistory(context.previousMessages || []);
      
      const completion = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.3,
        frequency_penalty: 0.3,
      });

      const aiMessage = completion.choices[0]?.message?.content || '';
      
      const response: AIResponse = {
        message: aiMessage,
        confidence: this.calculateConfidence(completion),
        suggestedMenuItems: this.extractMenuSuggestions(aiMessage, context.menuItems || []),
        needsHumanIntervention: this.needsHumanIntervention(userMessage, aiMessage),
      };
      
      const detectedIntent = this.detectIntent(userMessage);
      if (detectedIntent) {
        response.intent = detectedIntent;
      }
      
      return response;
      
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        message: "I apologize, but I'm having trouble processing your request right now. Let me get a human server to help you.",
        confidence: 0,
        needsHumanIntervention: true,
      };
    }
  }

  /**
   * Build system prompt with restaurant context
   */
  private buildSystemPrompt(context: AIConversationContext): string {
    const restaurantInfo = context.restaurantInfo || {
      name: 'AI-Mi Restaurant',
      description: 'A modern dining experience with AI-powered service',
      specialties: ['Contemporary cuisine', 'Fresh ingredients', 'Innovative presentation'],
      hours: '11:00 AM - 10:00 PM daily'
    };

    const customerInfo = context.customer ? 
      `Customer ID: ${context.customer.id} (Table ${context.customer.tableNumber || 'Not assigned'})
      Dietary restrictions: ${context.customer.preferences?.dietaryRestrictions?.join(', ') || 'None specified'}
      Allergies: ${context.customer.preferences?.allergies?.join(', ') || 'None specified'}
      Spice level preference: ${context.customer.preferences?.spiceLevel || 'medium'}` : '';

    const menuContext = context.menuItems?.length ? 
      `Available menu items: ${context.menuItems.map(item => 
        `${item.name} ($${item.price/100}) - ${item.description}`
      ).join('; ')}` : '';

    return `You are an AI-powered waiter at ${restaurantInfo.name}. ${restaurantInfo.description}.

Your role:
- Provide friendly, helpful, and professional service
- Help customers browse the menu and make recommendations
- Answer questions about ingredients, preparation, and dietary accommodations
- Take orders accurately and confirm details
- Handle complaints with empathy and offer solutions
- Know when to escalate to human staff

Restaurant details:
- Name: ${restaurantInfo.name}
- Hours: ${restaurantInfo.hours}
- Specialties: ${restaurantInfo.specialties.join(', ')}

${customerInfo}

${menuContext}

Guidelines:
- Be conversational but professional
- Ask clarifying questions when needed
- Suggest items based on customer preferences
- Mention dietary accommodations when relevant
- If you're unsure about something, say so and offer to get more information
- Keep responses concise but informative
- Use natural, friendly language

If a customer seems frustrated or has a complex request, acknowledge their concern and indicate you'll get additional help.`;
  }

  /**
   * Convert conversation messages to OpenAI format
   */
  private buildConversationHistory(messages: ConversationMessage[]): Array<{role: 'user' | 'assistant', content: string}> {
    return messages.map(msg => ({
      role: msg.role === 'customer' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));
  }

  /**
   * Calculate confidence score from OpenAI response
   */
  private calculateConfidence(completion: OpenAI.Chat.Completions.ChatCompletion): number {
    // Simple heuristic based on response characteristics
    const choice = completion.choices[0];
    if (!choice) return 0;
    
    const finishReason = choice.finish_reason;
    if (finishReason === 'stop') return 0.9;
    if (finishReason === 'length') return 0.7;
    return 0.5;
  }

  /**
   * Detect user intent from message
   */
  private detectIntent(message: string): AIResponse['intent'] {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('menu') || lowerMessage.includes('what do you have') || 
        lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return 'menu_inquiry';
    }
    
    if (lowerMessage.includes('order') || lowerMessage.includes('i want') || 
        lowerMessage.includes('i\'ll have') || lowerMessage.includes('get me')) {
      return 'order_intent';
    }
    
    if (lowerMessage.includes('complaint') || lowerMessage.includes('problem') || 
        lowerMessage.includes('wrong') || lowerMessage.includes('bad')) {
      return 'complaint';
    }
    
    if (lowerMessage.includes('allergy') || lowerMessage.includes('dietary') || 
        lowerMessage.includes('special') || lowerMessage.includes('modification')) {
      return 'special_request';
    }
    
    return 'general_chat';
  }

  /**
   * Extract menu item suggestions from AI response
   */
  private extractMenuSuggestions(aiMessage: string, menuItems: MenuItem[]): string[] {
    const suggestions: string[] = [];
    
    menuItems.forEach(item => {
      if (aiMessage.toLowerCase().includes(item.name.toLowerCase())) {
        suggestions.push(item.id);
      }
    });
    
    return suggestions;
  }

  /**
   * Determine if human intervention is needed
   */
  private needsHumanIntervention(userMessage: string, aiResponse: string): boolean {
    const lowerUser = userMessage.toLowerCase();
    const lowerAI = aiResponse.toLowerCase();
    
    // Escalate for complaints
    if (lowerUser.includes('manager') || lowerUser.includes('complaint') || 
        lowerUser.includes('terrible') || lowerUser.includes('awful')) {
      return true;
    }
    
    // Escalate if AI indicates uncertainty
    if (lowerAI.includes('i\'m not sure') || lowerAI.includes('let me get') || 
        lowerAI.includes('i don\'t know')) {
      return true;
    }
    
    return false;
  }

  /**
   * Mock response for development/testing
   */
  private getMockResponse(userMessage: string, context: AIConversationContext): AIResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('menu') || lowerMessage.includes('recommend')) {
      return {
        message: "I'd be happy to help you with our menu! We have some wonderful dishes today. Are you looking for any particular type of cuisine or do you have any dietary preferences I should know about?",
        confidence: 0.8,
        intent: 'menu_inquiry',
        suggestedMenuItems: context.menuItems?.slice(0, 3).map(item => item.id) || [],
      };
    }
    
    if (lowerMessage.includes('order') || lowerMessage.includes('want')) {
      return {
        message: "Perfect! I'd be happy to take your order. What would you like to start with today?",
        confidence: 0.9,
        intent: 'order_intent',
      };
    }
    
    return {
      message: "Hello! Welcome to AI-Mi Restaurant. I'm your AI assistant and I'm here to help make your dining experience wonderful. How can I assist you today?",
      confidence: 0.7,
      intent: 'general_chat',
    };
  }

  /**
   * Health check for AI service
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.openai.chat) {
        return false; // Mock mode
      }
      
      // Simple test completion
      await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 5,
      });
      
      return true;
    } catch (error) {
      console.error('AI Health Check Failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();