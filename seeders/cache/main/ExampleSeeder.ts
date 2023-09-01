import { ICacheSeeder } from '../../CacheSeeder';
import Redis from 'ioredis';

class ExampleSeeder implements ICacheSeeder {
  async seed(redis: Redis): Promise<void> {
    await redis.set('hello', 'world');
  }
}

export { ExampleSeeder };
