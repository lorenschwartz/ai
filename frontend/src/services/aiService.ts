// AI API Service
import { apiCall } from './api';
import type {
  AIChatRequest,
  AITestScenario,
  ApiResponse
} from '../types/api';

export class AIService {
  // Direct chat with AI (for testing)
  static async chat(request: AIChatRequest): Promise<ApiResponse<{
    response: string;
    conversationId?: string;
    metadata?: {
      intent?: string;
      confidence?: number;
      entities?: any[];
      suggestedActions?: string[];
    };
  }>> {
    return apiCall('POST', '/ai/chat', request);
  }

  // Check AI service health
  static async checkHealth(): Promise<ApiResponse<{
    status: string;
    openai: boolean;
    timestamp: string;
  }>> {
    return apiCall('GET', '/ai/health');
  }

  // Test AI scenarios
  static async testScenarios(scenarios: AITestScenario[]): Promise<ApiResponse<{
    results: Array<{
      scenario: string;
      success: boolean;
      response: string;
      error?: string;
    }>;
  }>> {
    return apiCall('POST', '/ai/test-scenarios', { scenarios });
  }

  // Helper: Quick chat without conversation context
  static async quickChat(message: string): Promise<ApiResponse<string>> {
    const response = await this.chat({ message });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.response,
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get AI response',
    };
  }

  // Helper: Chat with customer context
  static async chatWithContext(
    message: string,
    customerId: string,
    conversationId?: string,
    additionalContext?: any
  ): Promise<ApiResponse<{
    response: string;
    conversationId?: string;
    metadata?: any;
  }>> {
    const request: AIChatRequest = {
      message,
      customerId,
      conversationId,
      context: additionalContext,
    };

    return this.chat(request);
  }

  // Helper: Test single scenario
  static async testSingleScenario(scenario: AITestScenario): Promise<ApiResponse<{
    scenario: string;
    success: boolean;
    response: string;
    error?: string;
  }>> {
    const response = await this.testScenarios([scenario]);
    
    if (response.success && response.data?.results?.[0]) {
      return {
        success: true,
        data: response.data.results[0],
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to test scenario',
    };
  }

  // Predefined test scenarios
  static getCommonTestScenarios(): AITestScenario[] {
    return [
      {
        name: 'Menu Inquiry',
        description: 'Customer asking about menu items',
        messages: [
          { role: 'user', content: "What's on the menu today?" }
        ],
      },
      {
        name: 'Dietary Restrictions',
        description: 'Customer with dietary restrictions',
        messages: [
          { role: 'user', content: "I'm vegetarian. What options do you have?" }
        ],
      },
      {
        name: 'Order Placement',
        description: 'Customer placing an order',
        messages: [
          { role: 'user', content: "I'd like to order the pasta carbonara and a Caesar salad" }
        ],
      },
      {
        name: 'Allergy Concern',
        description: 'Customer asking about allergens',
        messages: [
          { role: 'user', content: "I have a nut allergy. Is the chicken dish safe?" }
        ],
      },
      {
        name: 'Recommendation Request',
        description: 'Customer asking for recommendations',
        messages: [
          { role: 'user', content: "What would you recommend for someone who likes spicy food?" }
        ],
      },
    ];
  }

  // Helper: Run common tests
  static async runCommonTests(): Promise<ApiResponse<{
    results: Array<{
      scenario: string;
      success: boolean;
      response: string;
      error?: string;
    }>;
  }>> {
    const scenarios = this.getCommonTestScenarios();
    return this.testScenarios(scenarios);
  }
}

export default AIService;