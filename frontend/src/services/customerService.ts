// Customer API Service
import { apiCall } from './api';
import type {
  Customer,
  CustomerPreferences,
  ApiResponse
} from '../types/api';

export class CustomerService {
  // Create new customer
  static async createCustomer(customerData: {
    name: string;
    email?: string;
    phone?: string;
    tableNumber?: string;
    preferences?: CustomerPreferences;
  }): Promise<ApiResponse<Customer>> {
    return apiCall<Customer>('POST', '/customers', customerData);
  }

  // Get customer by ID
  static async getCustomer(customerId: string): Promise<ApiResponse<Customer>> {
    return apiCall<Customer>('GET', `/customers/${customerId}`);
  }

  // Update customer information
  static async updateCustomer(
    customerId: string,
    updates: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<Customer>> {
    return apiCall<Customer>('PUT', `/customers/${customerId}`, updates);
  }

  // Update customer preferences
  static async updatePreferences(
    customerId: string,
    preferences: CustomerPreferences
  ): Promise<ApiResponse<Customer>> {
    return apiCall<Customer>('PUT', `/customers/${customerId}/preferences`, { preferences });
  }

  // Get customer by session ID
  static async getCustomerBySession(sessionId: string): Promise<ApiResponse<Customer>> {
    return apiCall<Customer>('GET', `/customers/session/${sessionId}`);
  }

  // Get customer by table number
  static async getCustomerByTable(tableNumber: string): Promise<ApiResponse<Customer[]>> {
    return apiCall<Customer[]>('GET', `/customers/table/${tableNumber}`);
  }

  // Helper: Create anonymous customer for table
  static async createAnonymousCustomer(tableNumber: string): Promise<ApiResponse<Customer>> {
    const customerData = {
      name: `Guest at Table ${tableNumber}`,
      tableNumber,
      sessionId: this.generateSessionId(),
    };

    return this.createCustomer(customerData);
  }

  // Helper: Generate session ID
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper: Add dietary restriction
  static async addDietaryRestriction(
    customerId: string,
    restriction: string
  ): Promise<ApiResponse<Customer>> {
    const customerResponse = await this.getCustomer(customerId);
    
    if (!customerResponse.success || !customerResponse.data) {
      return customerResponse;
    }

    const customer = customerResponse.data;
    const currentRestrictions = customer.preferences?.dietaryRestrictions || [];
    
    if (!currentRestrictions.includes(restriction)) {
      const updatedPreferences: CustomerPreferences = {
        ...customer.preferences,
        dietaryRestrictions: [...currentRestrictions, restriction],
      };

      return this.updatePreferences(customerId, updatedPreferences);
    }

    return customerResponse;
  }

  // Helper: Add allergy
  static async addAllergy(
    customerId: string,
    allergy: string
  ): Promise<ApiResponse<Customer>> {
    const customerResponse = await this.getCustomer(customerId);
    
    if (!customerResponse.success || !customerResponse.data) {
      return customerResponse;
    }

    const customer = customerResponse.data;
    const currentAllergies = customer.preferences?.allergies || [];
    
    if (!currentAllergies.includes(allergy)) {
      const updatedPreferences: CustomerPreferences = {
        ...customer.preferences,
        allergies: [...currentAllergies, allergy],
      };

      return this.updatePreferences(customerId, updatedPreferences);
    }

    return customerResponse;
  }

  // Helper: Set spice preference
  static async setSpicePreference(
    customerId: string,
    spiceLevel: 'mild' | 'medium' | 'hot' | 'extra-hot'
  ): Promise<ApiResponse<Customer>> {
    const customerResponse = await this.getCustomer(customerId);
    
    if (!customerResponse.success || !customerResponse.data) {
      return customerResponse;
    }

    const customer = customerResponse.data;
    const updatedPreferences: CustomerPreferences = {
      ...customer.preferences,
      spiceLevel,
    };

    return this.updatePreferences(customerId, updatedPreferences);
  }

  // Helper: Add favorite item
  static async addFavoriteItem(
    customerId: string,
    menuItemId: string
  ): Promise<ApiResponse<Customer>> {
    const customerResponse = await this.getCustomer(customerId);
    
    if (!customerResponse.success || !customerResponse.data) {
      return customerResponse;
    }

    const customer = customerResponse.data;
    const currentFavorites = customer.preferences?.favoriteItems || [];
    
    if (!currentFavorites.includes(menuItemId)) {
      const updatedPreferences: CustomerPreferences = {
        ...customer.preferences,
        favoriteItems: [...currentFavorites, menuItemId],
      };

      return this.updatePreferences(customerId, updatedPreferences);
    }

    return customerResponse;
  }
}

export default CustomerService;