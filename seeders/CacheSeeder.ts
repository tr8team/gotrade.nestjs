import Redis from 'ioredis';

interface ICacheSeeder {
  seed(redis: Redis): Promise<void>;
}

export type { ICacheSeeder };
