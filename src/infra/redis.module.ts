import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheConfig } from '../config/root/cache.config';
import Redis from 'ioredis';

@Module({})
export class RedisModule {
  static async register(
    context: string,
    redis: Record<string, symbol>,
  ): Promise<DynamicModule> {
    return {
      module: RedisModule,
      global: true,
      providers: [
        {
          provide: redis[context.toUpperCase()],
          inject: [ConfigService],
          useFactory: async (c: ConfigService) => {
            const configs = c.get<Record<string, CacheConfig>>('caches') ?? {};
            const config = configs[context];
            const { tls, ...conn } = config.connection;
            const t = tls
              ? {
                  tls: {
                    port: conn.port,
                  },
                }
              : {};
            return new Redis({
              ...conn,
              ...t,
            });
          },
        },
      ],
      exports: [redis[context.toUpperCase()]],
    };
  }
}
