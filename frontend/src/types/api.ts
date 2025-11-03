// TypeScript types matching backend models for AI-Mi

// Customer types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  preferences?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    favoriteItems?: string[];
    spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  };
  tableNumber?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPreferences {
  dietaryRestrictions?: string[];
  allergies?: string[];
  favoriteItems?: string[];
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
}

// Menu types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  ingredients: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  allergens?: string[];
  dietaryTags?: string[];
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  preparationTime?: number;
  popularity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  name: string;
  count: number;
  items?: MenuItem[];
}

export interface MenuFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  dietaryTags?: string[];
  allergens?: string[];
  spiceLevel?: string;
  isAvailable?: boolean;
}

export interface MenuSearchParams {
  query?: string;
  filters?: MenuFilters;
  sortBy?: 'name' | 'price' | 'popularity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Conversation types
export interface ConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: any[];
    suggestedActions?: string[];
  };
}

export interface Conversation {
  id: string;
  customerId: string;
  status: 'active' | 'paused' | 'completed';
  context?: {
    currentOrder?: string;
    preferences?: CustomerPreferences;
    sessionData?: any;
  };
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageRequest {
  content: string;
  role?: 'user' | 'assistant' | 'system';
  metadata?: any;
}

// Order types
export interface OrderItem {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  modifications?: string[];
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  totalAmount: number;
  specialInstructions?: string;
  estimatedPrepTime?: number;
  tableNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  customerId: string;
  items: Omit<OrderItem, 'unitPrice'>[];
  specialInstructions?: string;
  tableNumber?: string;
}

// AI types
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  customerId?: string;
  context?: any;
}

export interface AITestScenario {
  name: string;
  description: string;
  messages: AIMessage[];
  expectedResponse?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
}

// Restaurant types (for future use)
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: {
    [key: string]: { open: string; close: string } | null;
  };
  settings?: {
    currency: string;
    timezone: string;
    taxRate?: number;
    serviceChargeRate?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Feedback types (for future use)
export interface Feedback {
  id: string;
  customerId: string;
  orderId?: string;
  rating: number;
  comment?: string;
  category?: 'food' | 'service' | 'ambiance' | 'overall';
  isAnonymous: boolean;
  createdAt: string;
}

// Payment types (for future use)
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: 'cash' | 'card' | 'mobile' | 'online';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}