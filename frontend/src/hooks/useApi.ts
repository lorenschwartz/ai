// React Query hooks for AI-Mi API
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { MenuService } from '../services/menuService';
import { ConversationService } from '../services/conversationService';
import { CustomerService } from '../services/customerService';
import { AIService } from '../services/aiService';
import type {
  MenuSearchParams,
  CreateMessageRequest,
  AIChatRequest,
  AITestScenario
} from '../types/api';

// Query Keys
export const queryKeys = {
  menu: {
    all: ['menu'] as const,
    items: (params?: MenuSearchParams) => ['menu', 'items', params] as const,
    item: (id: string) => ['menu', 'item', id] as const,
    categories: () => ['menu', 'categories'] as const,
    search: (query: string, params?: any) => ['menu', 'search', query, params] as const,
    popular: (limit?: number) => ['menu', 'popular', limit] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    conversation: (id: string) => ['conversations', id] as const,
    messages: (id: string) => ['conversations', id, 'messages'] as const,
    customer: (customerId: string) => ['conversations', 'customer', customerId] as const,
  },
  customers: {
    all: ['customers'] as const,
    customer: (id: string) => ['customers', id] as const,
    session: (sessionId: string) => ['customers', 'session', sessionId] as const,
    table: (tableNumber: string) => ['customers', 'table', tableNumber] as const,
  },
  ai: {
    all: ['ai'] as const,
    health: () => ['ai', 'health'] as const,
  },
};

// Menu Hooks
export const useMenuItems = (params?: MenuSearchParams) => {
  return useQuery({
    queryKey: queryKeys.menu.items(params),
    queryFn: () => MenuService.getMenuItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMenuItem = (id: string) => {
  return useQuery({
    queryKey: queryKeys.menu.item(id),
    queryFn: () => MenuService.getMenuItem(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMenuCategories = () => {
  return useQuery({
    queryKey: queryKeys.menu.categories(),
    queryFn: () => MenuService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useMenuSearch = (query: string, params?: Omit<MenuSearchParams, 'query'>) => {
  return useQuery({
    queryKey: queryKeys.menu.search(query, params),
    queryFn: () => MenuService.searchMenuItems(query, params),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePopularItems = (limit = 10) => {
  return useQuery({
    queryKey: queryKeys.menu.popular(limit),
    queryFn: () => MenuService.getPopularItems(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Conversation Hooks
export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.conversation(conversationId),
    queryFn: () => ConversationService.getConversation(conversationId),
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useConversationMessages = (conversationId: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId),
    queryFn: () => ConversationService.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 5000, // Poll every 5 seconds for real-time feel
  });
};

export const useCustomerConversations = (customerId: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.customer(customerId),
    queryFn: () => ConversationService.getCustomerConversations(customerId),
    enabled: !!customerId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Customer Hooks
export const useCustomer = (customerId: string) => {
  return useQuery({
    queryKey: queryKeys.customers.customer(customerId),
    queryFn: () => CustomerService.getCustomer(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCustomerBySession = (sessionId: string) => {
  return useQuery({
    queryKey: queryKeys.customers.session(sessionId),
    queryFn: () => CustomerService.getCustomerBySession(sessionId),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// AI Hooks
export const useAIHealth = () => {
  return useQuery({
    queryKey: queryKeys.ai.health(),
    queryFn: () => AIService.checkHealth(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Check every minute
  });
};

// Mutation Hooks
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerData: Parameters<typeof CustomerService.createCustomer>[0]) =>
      CustomerService.createCustomer(customerData),
    onSuccess: (data) => {
      if (data.success && data.data) {
        queryClient.setQueryData(
          queryKeys.customers.customer(data.data.id),
          data
        );
      }
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, updates }: {
      customerId: string;
      updates: Parameters<typeof CustomerService.updateCustomer>[1];
    }) => CustomerService.updateCustomer(customerId, updates),
    onSuccess: (data, variables) => {
      if (data.success && data.data) {
        queryClient.setQueryData(
          queryKeys.customers.customer(variables.customerId),
          data
        );
      }
    },
  });
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customerId: string) => ConversationService.startConversation(customerId),
    onSuccess: (data, customerId) => {
      if (data.success && data.data) {
        // Invalidate customer conversations to include the new one
        queryClient.invalidateQueries({
          queryKey: queryKeys.conversations.customer(customerId),
        });
        
        // Set the new conversation data
        queryClient.setQueryData(
          queryKeys.conversations.conversation(data.data.id),
          data
        );
      }
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, message }: {
      conversationId: string;
      message: CreateMessageRequest;
    }) => ConversationService.sendMessage(conversationId, message),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate messages to trigger refetch
        queryClient.invalidateQueries({
          queryKey: queryKeys.conversations.messages(variables.conversationId),
        });
        
        // Also invalidate the conversation itself
        queryClient.invalidateQueries({
          queryKey: queryKeys.conversations.conversation(variables.conversationId),
        });
      }
    },
  });
};

export const useChatWithAI = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, message, metadata }: {
      conversationId: string;
      message: string;
      metadata?: any;
    }) => ConversationService.chatWithAI(conversationId, message, metadata),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate messages to show new user message and AI response
        queryClient.invalidateQueries({
          queryKey: queryKeys.conversations.messages(variables.conversationId),
        });
        
        // Update conversation
        queryClient.invalidateQueries({
          queryKey: queryKeys.conversations.conversation(variables.conversationId),
        });
      }
    },
  });
};

export const useStartConversationWithMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, message }: {
      customerId: string;
      message: string;
    }) => ConversationService.startConversationWithMessage(customerId, message),
    onSuccess: (data, variables) => {
      if (data.success && data.data) {
        const { conversation } = data.data;
        
        // Add new conversation to customer's conversations
        queryClient.invalidateQueries({
          queryKey: queryKeys.conversations.customer(variables.customerId),
        });
        
        // Set conversation data
        queryClient.setQueryData(
          queryKeys.conversations.conversation(conversation.id),
          { success: true, data: conversation }
        );
        
        // Set messages data
        queryClient.setQueryData(
          queryKeys.conversations.messages(conversation.id),
          { success: true, data: conversation.messages }
        );
      }
    },
  });
};

export const useAIChat = () => {
  return useMutation({
    mutationFn: (request: AIChatRequest) => AIService.chat(request),
  });
};

export const useTestAIScenarios = () => {
  return useMutation({
    mutationFn: (scenarios: AITestScenario[]) => AIService.testScenarios(scenarios),
  });
};