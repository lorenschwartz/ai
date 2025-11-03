// Base types and enums used across models

export enum OrderStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted", 
  ACKNOWLEDGED = "acknowledged",
  PREPARING = "preparing",
  READY = "ready",
  SERVED = "served",
  CANCELLED = "cancelled"
}

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded"
}

export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card", 
  APPLE_PAY = "apple_pay",
  GOOGLE_PAY = "google_pay",
  CASH = "cash"
}

export type ConversationRole = "customer" | "ai" | "staff";
export type ConversationTopic = "menu_exploration" | "ordering" | "payment" | "feedback" | "greeting";
export type CustomerIntent = "browsing" | "ordering" | "asking_question";
export type SentimentType = "positive" | "neutral" | "negative";
export type MenuCategory = "appetizer" | "entree" | "dessert" | "beverage";

// Common validation patterns
export const DIETARY_TAGS = [
  "vegetarian", 
  "vegan", 
  "gluten-free", 
  "dairy-free", 
  "keto", 
  "paleo"
] as const;

export const ALLERGENS = [
  "nuts", 
  "shellfish", 
  "eggs", 
  "dairy", 
  "gluten", 
  "soy", 
  "fish"
] as const;

export type DietaryTag = typeof DIETARY_TAGS[number];
export type Allergen = typeof ALLERGENS[number];