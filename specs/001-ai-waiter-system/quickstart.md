# AI Waiter System - Quickstart Guide

**Feature**: AI-powered conversational restaurant ordering  
**Target**: Development team and restaurant staff  
**Updated**: 2025-11-02  

## Overview

The AI Waiter System replaces traditional restaurant menus with a conversational AI interface that helps customers explore dishes, place orders, and process payments. Built as a progressive web application with real-time communication and POS integration.

## Architecture at a Glance

```
Customer ←→ Frontend (React) ←→ Backend (Node.js) ←→ AI (OpenAI) + Database (PostgreSQL) + POS System
```

## Quick Setup (Development)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- OpenAI API key
- Stripe account (for payments)

### 1. Environment Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd ai-waiter-system
npm install

# Setup environment variables
cp .env.example .env
# Configure: DATABASE_URL, REDIS_URL, OPENAI_API_KEY, STRIPE_SECRET_KEY
```

### 2. Database Setup

```bash
# Create database and run migrations
npm run db:setup
npm run db:migrate

# Seed with sample restaurant data
npm run db:seed
```

### 3. Start Development Servers

```bash
# Terminal 1: Backend API server
npm run dev:backend
# Runs on http://localhost:3000

# Terminal 2: Frontend development server  
npm run dev:frontend
# Runs on http://localhost:3001

# Terminal 3: Redis server (if not running as service)
redis-server
```

### 4. Test the System

1. Open browser to `http://localhost:3001`
2. Start a conversation: "What's good here?"
3. Explore menu through natural language
4. Place a test order
5. Complete payment flow

## Core User Flows

### 1. Customer Ordering Flow
```
Access Web App → Start Conversation → Explore Menu → Add Items → Review Order → Pay → Receive Confirmation
```

**Key Components:**
- `frontend/src/components/chat/ConversationInterface.tsx`
- `backend/src/services/conversation-ai.js`
- `backend/src/api/routes/orders.js`

### 2. Menu Management Flow  
```
POS System → Webhook → Update Menu → Invalidate Cache → Notify Active Sessions
```

**Key Components:**
- `backend/src/services/pos-integration.js`
- `backend/src/models/menu-item.js`

### 3. Payment Processing Flow
```
Customer Selects Payment → Stripe Processing → Split Handling → Receipt Generation → Loyalty Update
```

**Key Components:**
- `frontend/src/components/payment/PaymentForm.tsx`
- `backend/src/services/payment.js`

## Essential Configuration

### Restaurant Setup (Admin Dashboard)

1. **Basic Information**
   ```json
   {
     "name": "Demo Restaurant",
     "businessHours": {
       "monday": { "open": "09:00", "close": "22:00", "isOpen": true }
     }
   }
   ```

2. **Menu Integration**
   - Upload menu items or connect POS system
   - Configure dietary tags and allergen information
   - Set availability and pricing

3. **Payment Configuration**
   - Enable payment methods (credit cards, digital wallets)
   - Set tax rates and tip suggestions
   - Configure split payment options

### AI Conversation Settings

**Tone Configuration:**
```json
{
  "tone": "friendly",
  "welcomeMessage": "Hello! I'm your AI waiter today. What can I help you with?",
  "fallbackToHuman": true,
  "responseTimeout": 2000
}
```

**Recommendation Rules:**
- Dietary preference matching
- Price point considerations  
- Popularity scoring
- Complementary item suggestions

## Testing Strategy

### 1. Component Tests
```bash
# Frontend component testing
npm run test:frontend

# Backend unit tests  
npm run test:backend
```

### 2. Integration Tests
```bash
# API endpoint testing
npm run test:integration

# Conversation flow testing
npm run test:conversation
```

### 3. End-to-End Tests
```bash
# Full user journey testing
npm run test:e2e

# Voice input testing (requires browser environment)
npm run test:e2e:voice
```

## Deployment

### Production Environment

1. **Infrastructure Requirements**
   - Node.js server (2+ cores, 4GB RAM)
   - PostgreSQL database (with backup strategy)
   - Redis cache (for session management)
   - SSL certificate (required for voice input)

2. **Environment Variables**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...
   OPENAI_API_KEY=sk-...
   STRIPE_SECRET_KEY=sk_live_...
   ```

3. **Deploy Commands**
   ```bash
   npm run build
   npm run db:migrate:prod
   npm start
   ```

### Monitoring & Observability

**Key Metrics:**
- Conversation response time (<2s target)
- Order accuracy (>98% target)
- Payment success rate (>99% target)
- Customer satisfaction ratings

**Logging:**
- All conversations logged for AI improvement
- Order events tracked for audit trail
- Payment transactions logged for compliance

## Troubleshooting

### Common Issues

**"AI not responding"**
- Check OpenAI API key and quota
- Verify network connectivity
- Check conversation context size limits

**"Payment failed"**  
- Verify Stripe webhook configuration
- Check payment method compatibility
- Confirm test vs. live keys

**"Menu items not updating"**
- Verify POS system webhook setup
- Check cache invalidation
- Confirm database connectivity

### Development Tools

**Database Inspection:**
```bash
npm run db:console
# Opens PostgreSQL command line
```

**Redis Monitoring:**
```bash
redis-cli monitor
# Shows real-time Redis operations
```

**API Testing:**
```bash
npm run api:docs
# Opens interactive API documentation
```

## Next Steps

### Phase 1 Implementation Priority
1. **Core Conversation Engine** - Natural language menu exploration
2. **Basic Ordering System** - Add items to cart, calculate totals  
3. **Payment Processing** - Stripe integration with receipt generation
4. **Admin Dashboard** - Menu management and order monitoring

### Phase 2 Enhancements
1. **Advanced Recommendations** - ML-based suggestion engine
2. **Split Payment Features** - Multiple payment methods per order
3. **Real-time Updates** - Live order status from kitchen
4. **Voice Input Optimization** - Enhanced speech recognition

### Production Checklist
- [ ] SSL certificate installed
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Staff training completed

## Support & Resources

**Documentation:**
- [API Reference](./contracts/api-spec.json)
- [Data Model](./data-model.md)
- [Technical Research](./research.md)

**Development:**
- [Component Library](../frontend/src/components/README.md)
- [Testing Guide](../tests/README.md)
- [Deployment Guide](../docs/deployment.md)

**External Integrations:**
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [POS System Integration Guide](../docs/pos-integrations.md)