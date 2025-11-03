import { Router } from 'express';
import menuRoutes from './routes/menu';
import customerRoutes from './routes/customers';
import conversationRoutes from './routes/conversations';
import orderRoutes from './routes/orders-simple';

const router = Router();

// API versioning
const API_VERSION = 'v1';

// Mount route modules
router.use(`/${API_VERSION}/menu`, menuRoutes);
router.use(`/${API_VERSION}/customers`, customerRoutes);
router.use(`/${API_VERSION}/conversations`, conversationRoutes);
router.use(`/${API_VERSION}/orders`, orderRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: API_VERSION,
    endpoints: {
      menu: `/${API_VERSION}/menu`,
      customers: `/${API_VERSION}/customers`,
      conversations: `/${API_VERSION}/conversations`,
      orders: `/${API_VERSION}/orders`
    }
  });
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'AI-Mi Restaurant API',
    version: API_VERSION,
    description: 'AI-powered restaurant waiter system API',
    endpoints: {
      health: '/api/health',
      menu: {
        items: `GET /api/${API_VERSION}/menu/items`,
        item: `GET /api/${API_VERSION}/menu/items/:id`,
        categories: `GET /api/${API_VERSION}/menu/categories`,
        search: `GET /api/${API_VERSION}/menu/search`
      },
      customers: {
        create: `POST /api/${API_VERSION}/customers`,
        get: `GET /api/${API_VERSION}/customers/:id`,
        update: `PUT /api/${API_VERSION}/customers/:id`,
        activity: `POST /api/${API_VERSION}/customers/:id/activity`,
        session: `GET /api/${API_VERSION}/customers/session/:sessionId`,
        endSession: `DELETE /api/${API_VERSION}/customers/:id/session`
      },
      conversations: {
        create: `POST /api/${API_VERSION}/conversations`,
        get: `GET /api/${API_VERSION}/conversations/:id`,
        messages: {
          add: `POST /api/${API_VERSION}/conversations/:id/messages`,
          list: `GET /api/${API_VERSION}/conversations/:id/messages`
        },
        context: `PUT /api/${API_VERSION}/conversations/:id/context`,
        customer: `GET /api/${API_VERSION}/conversations/customer/:customerId`,
        delete: `DELETE /api/${API_VERSION}/conversations/:id`
      },
      orders: {
        create: `POST /api/${API_VERSION}/orders`,
        get: `GET /api/${API_VERSION}/orders/:id`,
        update: `PUT /api/${API_VERSION}/orders/:id`,
        addItem: `POST /api/${API_VERSION}/orders/:id/items`,
        customer: `GET /api/${API_VERSION}/orders/customer/:customerId`,
        cancel: `POST /api/${API_VERSION}/orders/:id/cancel`
      }
    },
    features: [
      'Menu browsing with filtering and search',
      'Customer session management',
      'AI-powered conversation handling',
      'Order management with status tracking',
      'Real-time updates and notifications'
    ]
  });
});

export default router;