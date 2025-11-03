// Conversation API Service
import { apiCall } from './api';
import type {
  Conversation,
  ConversationMessage,
  CreateMessageRequest,
  ApiResponse
} from '../types/api';

export class ConversationService {
  // Start a new conversation
  static async startConversation(customerId: string): Promise<ApiResponse<Conversation>> {
    return apiCall<Conversation>('POST', '/conversations', { customerId });
  }

  // Get conversation by ID
  static async getConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
    return apiCall<Conversation>('GET', `/conversations/${conversationId}`);
  }

  // Get customer's conversations
  static async getCustomerConversations(customerId: string): Promise<ApiResponse<Conversation[]>> {
    return apiCall<Conversation[]>('GET', `/conversations/customer/${customerId}`);
  }

  // Send message in conversation (with automatic AI response)
  static async sendMessage(
    conversationId: string, 
    messageRequest: CreateMessageRequest
  ): Promise<ApiResponse<{ userMessage: ConversationMessage; aiResponse?: ConversationMessage }>> {
    return apiCall<{ userMessage: ConversationMessage; aiResponse?: ConversationMessage }>(
      'POST',
      `/conversations/${conversationId}/messages`,
      messageRequest
    );
  }

  // Get conversation messages
  static async getMessages(conversationId: string): Promise<ApiResponse<ConversationMessage[]>> {
    return apiCall<ConversationMessage[]>('GET', `/conversations/${conversationId}/messages`);
  }

  // Update conversation context
  static async updateContext(conversationId: string, context: any): Promise<ApiResponse<Conversation>> {
    return apiCall<Conversation>('PUT', `/conversations/${conversationId}/context`, { context });
  }

  // Update conversation status
  static async updateStatus(
    conversationId: string, 
    status: 'active' | 'paused' | 'completed'
  ): Promise<ApiResponse<Conversation>> {
    return apiCall<Conversation>('PUT', `/conversations/${conversationId}/status`, { status });
  }

  // Helper: Send user message and get AI response
  static async chatWithAI(
    conversationId: string,
    userMessage: string,
    metadata?: any
  ): Promise<ApiResponse<{ userMessage: ConversationMessage; aiResponse?: ConversationMessage }>> {
    const messageRequest: CreateMessageRequest = {
      content: userMessage,
      role: 'user',
      metadata,
    };

    return this.sendMessage(conversationId, messageRequest);
  }

  // Helper: Start conversation with initial message
  static async startConversationWithMessage(
    customerId: string,
    initialMessage: string
  ): Promise<ApiResponse<{ conversation: Conversation; userMessage: ConversationMessage; aiResponse?: ConversationMessage }>> {
    // First create the conversation
    const conversationResponse = await this.startConversation(customerId);
    
    if (!conversationResponse.success || !conversationResponse.data) {
      return {
        success: false,
        error: conversationResponse.error || 'Failed to create conversation',
      };
    }

    const conversation = conversationResponse.data;

    // Then send the initial message
    const messageResponse = await this.chatWithAI(conversation.id, initialMessage);
    
    if (!messageResponse.success) {
      return {
        success: false,
        error: messageResponse.error || 'Failed to send initial message',
      };
    }

    return {
      success: true,
      data: {
        conversation,
        ...messageResponse.data!,
      },
    };
  }

  // Helper: Get conversation summary
  static async getConversationSummary(conversationId: string): Promise<ApiResponse<{
    messageCount: number;
    lastActivity: string;
    status: string;
    context?: any;
  }>> {
    const response = await this.getConversation(conversationId);
    
    if (!response.success || !response.data) {
      return response as ApiResponse<any>;
    }

    const conversation = response.data;
    
    return {
      success: true,
      data: {
        messageCount: conversation.messages.length,
        lastActivity: conversation.updatedAt,
        status: conversation.status,
        context: conversation.context,
      },
    };
  }

  // Helper: Get active conversations for customer
  static async getActiveConversations(customerId: string): Promise<ApiResponse<Conversation[]>> {
    const response = await this.getCustomerConversations(customerId);
    
    if (!response.success || !response.data) {
      return response;
    }

    const activeConversations = response.data.filter(conv => conv.status === 'active');
    
    return {
      success: true,
      data: activeConversations,
    };
  }
}

export default ConversationService;