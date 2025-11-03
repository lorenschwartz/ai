import { describe, it, expect } from '@jest/globals';
import { Customer, CustomerValidator } from '../../src/models/Customer';
import { MenuItem, MenuItemValidator } from '../../src/models/MenuItem';
import { Order, OrderValidator } from '../../src/models/Order';
import { OrderStatus, PaymentStatus } from '../../src/models/types';

describe('Customer Model', () => {
  const validCustomer: Customer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    sessionId: 'session-123',
    tableNumber: 'T5',
    preferences: {
      dietary: ['vegetarian'],
      allergies: ['nuts'],
      spiceLevel: 3,
      previousOrders: []
    },
    createdAt: new Date(),
    lastActiveAt: new Date()
  };

  it('should validate a valid customer', () => {
    expect(() => CustomerValidator.validate(validCustomer)).not.toThrow();
  });

  it('should validate spice level correctly', () => {
    expect(CustomerValidator.isValidSpiceLevel(3)).toBe(true);
    expect(CustomerValidator.isValidSpiceLevel(0)).toBe(false);
    expect(CustomerValidator.isValidSpiceLevel(6)).toBe(false);
  });

  it('should check active session correctly', () => {
    const activeCustomer = {
      ...validCustomer,
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    };
    expect(CustomerValidator.isActiveSession(activeCustomer)).toBe(true);

    const inactiveCustomer = {
      ...validCustomer,
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    };
    expect(CustomerValidator.isActiveSession(inactiveCustomer)).toBe(false);
  });
});

describe('MenuItem Model', () => {
  const validMenuItem: MenuItem = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with croutons and parmesan',
    category: 'appetizer',
    price: 1299, // $12.99
    ingredients: ['romaine lettuce', 'croutons', 'parmesan cheese'],
    dietaryTags: ['vegetarian'],
    allergens: ['dairy'],
    spiceLevel: 1,
    preparationTime: 10,
    availability: {
      isAvailable: true
    },
    popularityScore: 85,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should validate a valid menu item', () => {
    expect(() => MenuItemValidator.validate(validMenuItem)).not.toThrow();
  });

  it('should check availability correctly', () => {
    expect(MenuItemValidator.isAvailable(validMenuItem)).toBe(true);
    
    const unavailableItem = {
      ...validMenuItem,
      availability: { isAvailable: false, reason: 'out of stock' }
    };
    expect(MenuItemValidator.isAvailable(unavailableItem)).toBe(false);
  });

  it('should calculate price in dollars correctly', () => {
    expect(MenuItemValidator.calculatePriceInDollars(validMenuItem)).toBe(12.99);
  });

  it('should match allergies correctly', () => {
    expect(MenuItemValidator.matchesAllergies(validMenuItem, [])).toBe(true);
    expect(MenuItemValidator.matchesAllergies(validMenuItem, ['nuts'])).toBe(true);
    expect(MenuItemValidator.matchesAllergies(validMenuItem, ['dairy'])).toBe(false);
  });
});

describe('Order Model', () => {
  const validOrder: Order = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    customerId: '123e4567-e89b-12d3-a456-426614174000',
    restaurantId: '123e4567-e89b-12d3-a456-426614174002',
    items: [{
      id: '123e4567-e89b-12d3-a456-426614174004',
      menuItemId: '123e4567-e89b-12d3-a456-426614174001',
      quantity: 2,
      unitPrice: 1299,
      modifications: ['no croutons'],
      totalPrice: 2598
    }],
    status: OrderStatus.DRAFT,
    totalAmount: 2810, // 2598 + 212 tax
    taxAmount: 212,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should validate a valid order', () => {
    expect(() => OrderValidator.validate(validOrder)).not.toThrow();
  });

  it('should calculate order subtotal correctly', () => {
    const subtotal = OrderValidator.calculateOrderSubtotal(validOrder);
    expect(subtotal).toBe(2598);
  });

  it('should validate order total correctly', () => {
    expect(OrderValidator.validateOrderTotal(validOrder)).toBe(true);
  });

  it('should check status transitions correctly', () => {
    expect(OrderValidator.canTransitionStatus(OrderStatus.DRAFT, OrderStatus.SUBMITTED)).toBe(true);
    expect(OrderValidator.canTransitionStatus(OrderStatus.SERVED, OrderStatus.CANCELLED)).toBe(false);
  });

  it('should identify terminal states correctly', () => {
    expect(OrderValidator.isTerminalStatus(OrderStatus.SERVED)).toBe(true);
    expect(OrderValidator.isTerminalStatus(OrderStatus.CANCELLED)).toBe(true);
    expect(OrderValidator.isTerminalStatus(OrderStatus.DRAFT)).toBe(false);
  });
});