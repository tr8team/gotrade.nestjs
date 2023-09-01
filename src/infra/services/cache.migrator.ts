import { IMigrator } from './migrator.interface';
import { ConfigService } from '@nestjs/config';
import { INestApplicationContext } from '@nestjs/common';
import { ICacheSeeder } from '../../../seeders/CacheSeeder';
import { CacheConfig } from '../../config/root/cache.config';
import Redis from 'ioredis';
import { delay } from '../util';
import { PinoLogger } from 'nestjs-pino';

class CacheMigrator implements IMigrator {
  constructor(
    private readonly c: ConfigService,
    private readonly moduleRef: INestApplicationContext,
    private readonly mapping: Record<string, symbol>,
    private readonly seeders: Record<symbol, ICacheSeeder | null | undefined>,
    private readonly logger: PinoLogger,
  ) {}

  async migrate(): Promise<void> {
    const configs = this.c.get<Record<string, CacheConfig>>('caches') ?? {};

    const waiter = Object.entries(configs).map(async ([name, config]) => {
      const token = this.mapping[name.toUpperCase()];
      const redis = this.moduleRef.get<Redis>(token);
      const mode = this.c.get<string>('mode')! as 'app' | 'migration';

      if (
        (mode === 'migration' && config.migration.autoSeed) ||
        (mode === 'app' && config.dev.autoSeed)
      ) {
        this.logger.info("start seeding '%s' redis", name);
        try {
          const sym = this.mapping[name.toUpperCase()];
          const seeder = this.seeders[sym];
          if (seeder) await seeder.seed(redis);
        } catch (e) {
          this.logger.error(e);
        }
      }
    });
    await Promise.all(waiter);
  }

  async wait(): Promise<void> {
    const cacheConfigs =
      this.c.get<Record<string, CacheConfig>>('caches') ?? {};
    const waiter = Object.entries(cacheConfigs).map(async ([name, config]) => {
      const token = this.mapping[name.toUpperCase()];
      const redis = this.moduleRef.get<Redis>(token);
      const timeout = Math.floor(config.connection.connectTimeout / 1000);
      let count = 0;
      while (count < timeout) {
        try {
          await redis.ping();
          this.logger.info("connected to cache '%s'", name);
          return;
        } catch (e) {
          await delay(1000);
          this.logger.info(
            `waiting for cache '%s' to connect, attempt: '%d'`,
            name,
            count,
          );
          count++;
        }
      }
      this.logger.error("can't connect to cache '%s'", name);
      throw new Error(`failed to connect to cache '${name}'`);
    });
    await Promise.all(waiter);
  }
}

export { CacheMigrator };
