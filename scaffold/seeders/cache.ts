function generateCacheSeeder(name: string): [string, string] {
  const s = `import { ICacheSeeder } from '../../CacheSeeder';
import Redis from 'ioredis';

class ExampleSeeder implements ICacheSeeder {
  async seed(redis: Redis): Promise<void> {
    await redis.connect();
  }
}

export { ExampleSeeder };`;

  return [`./seeders/cache/${name}/ExampleSeeder.ts`, s];
}

export { generateCacheSeeder };
