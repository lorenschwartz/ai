// Configuration Studio API Service
import { apiCall } from './api';
import type {
  ApiResponse,
  RestaurantConfig,
  Table,
  CreateTableRequest,
  UpdateTableRequest,
  SpecialInstruction,
  CreateSpecialInstructionRequest,
  UpdateSpecialInstructionRequest,
  MenuItem,
  CreateMenuItemRequest,
  UpdateMenuItemRequest
} from '../types/api';

export class ConfigService {
  // Restaurant Configuration
  static async getRestaurantConfig(): Promise<ApiResponse<RestaurantConfig>> {
    return apiCall<RestaurantConfig>('GET', '/config/restaurant');
  }

  static async updateRestaurantConfig(config: Partial<RestaurantConfig>): Promise<ApiResponse<RestaurantConfig>> {
    return apiCall<RestaurantConfig>('PUT', '/config/restaurant', config);
  }

  // Tables Management
  static async getTables(filters?: { status?: string; isActive?: boolean }): Promise<ApiResponse<{ data: Table[]; total: number }>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall<{ data: Table[]; total: number }>('GET', `/config/tables${query}`);
  }

  static async getTable(id: string): Promise<ApiResponse<Table>> {
    return apiCall<Table>('GET', `/config/tables/${id}`);
  }

  static async createTable(data: CreateTableRequest): Promise<ApiResponse<Table>> {
    return apiCall<Table>('POST', '/config/tables', data);
  }

  static async updateTable(id: string, data: UpdateTableRequest): Promise<ApiResponse<Table>> {
    return apiCall<Table>('PUT', `/config/tables/${id}`, data);
  }

  static async deleteTable(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiCall<{ message: string }>('DELETE', `/config/tables/${id}`);
  }

  // Special Instructions Management
  static async getInstructions(filters?: { 
    type?: string; 
    priority?: string; 
    isActive?: boolean; 
    showToAI?: boolean 
  }): Promise<ApiResponse<{ data: SpecialInstruction[]; total: number }>> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.showToAI !== undefined) params.append('showToAI', String(filters.showToAI));
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall<{ data: SpecialInstruction[]; total: number }>('GET', `/config/instructions${query}`);
  }

  static async getAIInstructions(): Promise<ApiResponse<{ data: SpecialInstruction[]; total: number }>> {
    return apiCall<{ data: SpecialInstruction[]; total: number }>('GET', '/config/instructions/ai');
  }

  static async getInstruction(id: string): Promise<ApiResponse<SpecialInstruction>> {
    return apiCall<SpecialInstruction>('GET', `/config/instructions/${id}`);
  }

  static async createInstruction(data: CreateSpecialInstructionRequest): Promise<ApiResponse<SpecialInstruction>> {
    return apiCall<SpecialInstruction>('POST', '/config/instructions', data);
  }

  static async updateInstruction(id: string, data: UpdateSpecialInstructionRequest): Promise<ApiResponse<SpecialInstruction>> {
    return apiCall<SpecialInstruction>('PUT', `/config/instructions/${id}`, data);
  }

  static async deleteInstruction(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiCall<{ message: string }>('DELETE', `/config/instructions/${id}`);
  }

  // Menu Items CRUD (for configuration)
  static async createMenuItem(data: CreateMenuItemRequest): Promise<ApiResponse<MenuItem>> {
    return apiCall<MenuItem>('POST', '/config/menu-items', data);
  }

  static async updateMenuItem(id: string, data: UpdateMenuItemRequest): Promise<ApiResponse<MenuItem>> {
    return apiCall<MenuItem>('PUT', `/config/menu-items/${id}`, data);
  }

  static async deleteMenuItem(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiCall<{ message: string }>('DELETE', `/config/menu-items/${id}`);
  }
}

export default ConfigService;
