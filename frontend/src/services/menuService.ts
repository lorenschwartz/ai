// Menu API Service
import { apiCall } from './api';
import type {
  MenuItem,
  MenuCategory,
  MenuSearchParams,
  PaginatedResponse,
  ApiResponse
} from '../types/api';

export class MenuService {
  // Get all menu items with optional filtering
  static async getMenuItems(params?: MenuSearchParams): Promise<ApiResponse<PaginatedResponse<MenuItem>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.filters?.category) queryParams.append('category', params.filters.category);
    if (params?.filters?.minPrice) queryParams.append('minPrice', params.filters.minPrice.toString());
    if (params?.filters?.maxPrice) queryParams.append('maxPrice', params.filters.maxPrice.toString());
    if (params?.filters?.dietaryTags?.length) {
      params.filters.dietaryTags.forEach(tag => queryParams.append('dietaryTags', tag));
    }
    if (params?.filters?.allergens?.length) {
      params.filters.allergens.forEach(allergen => queryParams.append('allergens', allergen));
    }
    if (params?.filters?.spiceLevel) queryParams.append('spiceLevel', params.filters.spiceLevel);
    if (params?.filters?.isAvailable !== undefined) {
      queryParams.append('isAvailable', params.filters.isAvailable.toString());
    }
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/menu/items${queryString ? `?${queryString}` : ''}`;
    
    return apiCall<PaginatedResponse<MenuItem>>('GET', endpoint);
  }

  // Search menu items
  static async searchMenuItems(query: string, params?: Omit<MenuSearchParams, 'query'>): Promise<ApiResponse<PaginatedResponse<MenuItem>>> {
    const queryParams = new URLSearchParams({ query });
    
    if (params?.filters?.category) queryParams.append('category', params.filters.category);
    if (params?.filters?.minPrice) queryParams.append('minPrice', params.filters.minPrice.toString());
    if (params?.filters?.maxPrice) queryParams.append('maxPrice', params.filters.maxPrice.toString());
    if (params?.filters?.dietaryTags?.length) {
      params.filters.dietaryTags.forEach(tag => queryParams.append('dietaryTags', tag));
    }
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return apiCall<PaginatedResponse<MenuItem>>('GET', `/menu/search?${queryParams.toString()}`);
  }

  // Get menu categories
  static async getCategories(): Promise<ApiResponse<MenuCategory[]>> {
    return apiCall<MenuCategory[]>('GET', '/menu/categories');
  }

  // Get single menu item by ID
  static async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    return apiCall<MenuItem>('GET', `/menu/items/${id}`);
  }

  // Get popular items
  static async getPopularItems(limit = 10): Promise<ApiResponse<MenuItem[]>> {
    const queryParams = new URLSearchParams({
      sortBy: 'popularity',
      sortOrder: 'desc',
      limit: limit.toString(),
    });
    
    const response = await apiCall<PaginatedResponse<MenuItem>>('GET', `/menu/items?${queryParams.toString()}`);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    
    return response as ApiResponse<MenuItem[]>;
  }

  // Get items by category
  static async getItemsByCategory(category: string, params?: Omit<MenuSearchParams, 'filters'>): Promise<ApiResponse<PaginatedResponse<MenuItem>>> {
    const searchParams: MenuSearchParams = {
      ...params,
      filters: { category },
    };
    
    return this.getMenuItems(searchParams);
  }

  // Get dietary-friendly items
  static async getDietaryFriendlyItems(
    dietaryTags: string[],
    params?: Omit<MenuSearchParams, 'filters'>
  ): Promise<ApiResponse<PaginatedResponse<MenuItem>>> {
    const searchParams: MenuSearchParams = {
      ...params,
      filters: { dietaryTags },
    };
    
    return this.getMenuItems(searchParams);
  }
}

export default MenuService;