# Data Model: AI Waiter System

**Phase**: 1 - Design  
**Created**: 2025-11-02  
**Technology Stack**: PostgreSQL + Redis, Node.js/TypeScript  

## Core Entities

### Customer

Represents dining guests with preferences and session state.

```typescript
interface Customer {
  id: string;                    // UUID
  sessionId: string;             // Current dining session
  tableNumber?: string;          // Physical table identifier
  preferences: {
    dietary: string[];           // ["vegetarian", "gluten-free", "dairy-free"]
    allergies: string[];         // ["nuts", "shellfish", "eggs"]
    spiceLevel: number;          // 1-5 scale
    previousOrders?: string[];   // Historical order IDs for recommendations
  };
  createdAt: Date;
  lastActiveAt: Date;
}
```

**Validation Rules**:

- sessionId must be unique per active session
- preferences.dietary must be from predefined list
- spiceLevel must be 1-5 integer
- lastActiveAt updated on every interaction

### MenuItem

Contains dish details with rich metadata for AI conversations.

```typescript
interface MenuItem {
  id: string;                    // UUID
  restaurantId: string;          // Foreign key
  name: string;                  // Display name
  description: string;           // Detailed description for AI
  category: string;              // "appetizer", "entree", "dessert", "beverage"
  price: number;                 // In cents for precision
  ingredients: string[];         // For allergy/dietary filtering
  dietaryTags: string[];         // ["vegetarian", "vegan", "gluten-free"]
  allergens: string[];           // ["nuts", "dairy", "gluten", "shellfish"]
  spiceLevel?: number;           // 1-5 scale if applicable
  preparationTime: number;       // Minutes
  availability: {
    isAvailable: boolean;
    reason?: string;             // "out of stock", "seasonal", etc.
  };
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  imageUrl?: string;
  popularityScore: number;       // For recommendations (0-100)
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Rules**:

- price must be positive integer (cents)
- category must be from predefined list
- preparationTime must be positive integer
- popularityScore must be 0-100
- ingredients and allergens must be from controlled vocabulary

### Order

Tracks customer selections with modifications and status.

```typescript
interface Order {
  id: string;                    // UUID
  customerId: string;            // Foreign key
  restaurantId: string;          // Foreign key
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;           // In cents, calculated
  taxAmount: number;             // In cents
  tipAmount?: number;            // In cents
  specialInstructions?: string;
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  menuItemId: string;            // Foreign key
  quantity: number;
  unitPrice: number;             // In cents, snapshot at order time
  modifications: string[];       // ["no onions", "extra cheese", "medium rare"]
  totalPrice: number;            // quantity * unitPrice + modifications
}

enum OrderStatus {
  DRAFT = "draft",               // Being built by customer
  SUBMITTED = "submitted",       // Sent to kitchen
  ACKNOWLEDGED = "acknowledged", // Kitchen confirmed receipt
  PREPARING = "preparing",       // In preparation
  READY = "ready",              // Ready for pickup/serving
  SERVED = "served",            // Delivered to customer
  CANCELLED = "cancelled"
}

enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded"
}
```

**Validation Rules**:

- quantity must be positive integer
- totalAmount must equal sum of items + tax
- status transitions must follow valid flow
- unitPrice captures historical pricing

### Conversation

Maintains dialogue context for coherent AI interactions.

```typescript
interface Conversation {
  id: string;                    // UUID
  customerId: string;            // Foreign key
  sessionId: string;             // Links to customer session
  currentOrderId?: string;       // Foreign key to active order
  context: {
    currentTopic: string;        // "menu_exploration", "ordering", "payment"
    lastMenuCategory?: string;   // For context continuity
    discussedItems: string[];    // MenuItem IDs mentioned
    customerIntent: string;      // "browsing", "ordering", "asking_question"
    preferences: {               // Session-specific preferences
      dietary?: string[];
      priceRange?: { min: number; max: number; };
      coursePreference?: string; // "appetizer", "main", "dessert"
    };
  };
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;              // Auto-cleanup inactive conversations
}

interface ConversationMessage {
  id: string;
  role: "customer" | "ai" | "staff";
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;         // AI confidence score
    intent?: string;            // Detected customer intent
    entities?: Record<string, any>; // Extracted entities (items, quantities)
  };
}
```

**Validation Rules**:

- expiresAt must be within 4 hours of creation
- messages must maintain chronological order
- currentOrderId must exist if status is "ordering"

### Payment

Handles transaction processing with audit trail.

```typescript
interface Payment {
  id: string;                    // UUID
  orderId: string;               // Foreign key
  customerId: string;            // Foreign key
  amount: number;                // In cents
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string; // External payment processor reference
  splits?: PaymentSplit[];       // For split payments
  receipt: {
    receiptId: string;
    emailSent: boolean;
    downloadUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentSplit {
  customerId: string;
  amount: number;                // In cents
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
}

enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  APPLE_PAY = "apple_pay",
  GOOGLE_PAY = "google_pay",
  CASH = "cash"
}
```

**Validation Rules**:

- amount must match order total
- splits must sum to total amount
- payment method must be supported by restaurant

### Restaurant

Configuration and settings for establishment.

```typescript
interface Restaurant {
  id: string;                    // UUID
  name: string;
  settings: {
    businessHours: {
      [day: string]: {           // "monday", "tuesday", etc.
        open: string;            // "09:00"
        close: string;           // "22:00"
        isOpen: boolean;
      };
    };
    paymentMethods: PaymentMethod[];
    taxRate: number;             // Decimal (e.g., 0.08 for 8%)
    tipSuggestions: number[];    // [15, 18, 20, 25] percentages
    posIntegration: {
      provider: string;          // "toast", "square", "lightspeed"
      apiKey: string;            // Encrypted
      webhookUrl: string;
    };
  };
  branding: {
    tone: string;                // "friendly", "formal", "casual"
    welcomeMessage: string;
    logoUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Rules**:

- businessHours must have valid time format
- taxRate must be 0-1 decimal
- tipSuggestions must be positive integers

### Feedback

Customer satisfaction and sentiment data.

```typescript
interface Feedback {
  id: string;                    // UUID
  customerId: string;            // Foreign key
  orderId: string;               // Foreign key
  ratings: {
    overall: number;             // 1-5 stars
    foodQuality: number;         // 1-5 stars
    serviceSpeed: number;        // 1-5 stars
    aiInteraction: number;       // 1-5 stars
  };
  comments?: string;
  sentiment: "positive" | "neutral" | "negative";
  createdAt: Date;
}
```

**Validation Rules**:

- ratings must be 1-5 integers
- sentiment auto-calculated from comments if provided
- linked order must be completed

## Relationships

```mermaid
Restaurant (1) ←→ (N) MenuItem
Restaurant (1) ←→ (N) Order
Customer (1) ←→ (N) Order
Customer (1) ←→ (N) Conversation
Customer (1) ←→ (N) Feedback
Order (1) ←→ (N) OrderItem
Order (1) ←→ (1) Payment
MenuItem (1) ←→ (N) OrderItem
Conversation (1) ←→ (0..1) Order [current order]
```

## State Transitions

### Order Status Flow

```mermaid
DRAFT → SUBMITTED → ACKNOWLEDGED → PREPARING → READY → SERVED
         ↓
      CANCELLED (from any status except SERVED)
```

### Payment Status Flow

```mermaid
PENDING → PROCESSING → COMPLETED
           ↓
         FAILED
         
COMPLETED → REFUNDED (partial or full)
```

### Conversation Context Flow

```mermaid
"greeting" → "menu_exploration" → "ordering" → "payment" → "feedback"
                ↑_______________|              ↑
                   (can cycle)                  |
                                              "completed"
```

## Performance Considerations

### Indexing Strategy

- Customer: sessionId, tableNumber
- MenuItem: restaurantId, category, availability.isAvailable
- Order: customerId, restaurantId, status, createdAt
- Conversation: customerId, sessionId, expiresAt
- Payment: orderId, status

### Caching Strategy

- MenuItem: Cache by restaurantId (TTL: 1 hour, invalidate on POS sync)
- Customer preferences: Cache in Redis (TTL: session duration)
- Conversation context: Store in Redis for fast access

### Data Cleanup

- Conversations: Auto-delete after expiresAt
- Customer sessions: Archive after 24 hours of inactivity
- Feedback: Aggregate to analytics after 30 days
