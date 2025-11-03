import { Pool, PoolConfig } from 'pg';
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PostgreSQL configuration
const pgConfig: PoolConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'ai_mi_dev',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 500, // Short timeout for quick dev failure
};

// Create PostgreSQL connection pool
export const db = new Pool(pgConfig);

// Redis configuration
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client
export const redis: RedisClientType = createClient({
  url: redisUrl,
  socket: {
    connectTimeout: 500, // Short timeout for quick dev failure
  },
});

// Database connection functions
export async function connectToDatabase(): Promise<void> {
  try {
    // Test PostgreSQL connection
    const client = await db.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();

    // Connect to Redis
    await redis.connect();
    console.log('✅ Connected to Redis');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  try {
    await db.end();
    await redis.quit();
    console.log('✅ Disconnected from databases');
  } catch (error) {
    console.error('❌ Error disconnecting from databases:', error);
    throw error;
  }
}

// Health check functions
export async function checkDatabaseHealth(): Promise<{
  postgresql: boolean;
  redis: boolean;
}> {
  const health = {
    postgresql: false,
    redis: false
  };

  try {
    // Check PostgreSQL
    const client = await db.connect();
    await client.query('SELECT 1');
    client.release();
    health.postgresql = true;
  } catch (error) {
    console.error('PostgreSQL health check failed:', error);
  }

  try {
    // Check Redis
    await redis.ping();
    health.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  return health;
}

// Session management functions for Redis
export const session = {
  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (ttlSeconds) {
        await redis.setEx(key, ttlSeconds, value);
      } else {
        await redis.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }
};