import { IMigrator } from './migrator.interface';
import { ConfigService } from '@nestjs/config';
import { INestApplicationContext } from '@nestjs/common';
import { IStorageSeeder } from '../../../seeders/StorageSeeder';
import { StorageConfig } from '../../config/root/storage.config';
import { delay } from '../util';
import { StorageService } from './storage.service';
import { PinoLogger } from 'nestjs-pino';

class StorageMigrator implements IMigrator {
  constructor(
    private readonly c: ConfigService,
    private readonly moduleRef: INestApplicationContext,
    private readonly mapping: Record<string, symbol>,
    private readonly seeders: Record<symbol, IStorageSeeder | null | undefined>,
    private readonly logger: PinoLogger,
  ) {}

  async migrate(): Promise<void> {
    const stores = this.c.get<Record<string, StorageConfig>>('storages') ?? [];
    const config = this.c.get<string>('mode')! as 'app' | 'migration';

    const migrations = Object.entries(stores).map(
      async ([name, storeConfig]) => {
        const token = this.mapping[name.toUpperCase()];
        const client = this.moduleRef.get<StorageService>(token, {
          strict: false,
        });

        if (
          (config === 'migration' && storeConfig.migration.autoMigrate) ||
          (config === 'app' && storeConfig.dev.autoMigrate)
        ) {
          this.logger.info("start migrating '%s' store", name);

          const exist = await client.minio.bucketExists(
            storeConfig.connection.bucket,
          );
          if (!exist)
            await client.minio.makeBucket(storeConfig.connection.bucket);
        }
        if (
          (config === 'migration' && storeConfig.migration.autoSeed) ||
          (config === 'app' && storeConfig.dev.autoSeed)
        ) {
          this.logger.info("start seeding '%s' store", name);
          const seed = this.seeders[token];
          if (seed) await seed.seed(client);
        }
      },
    );
    await Promise.all(migrations);
  }

  async wait(): Promise<void> {
    const storeConfigs =
      this.c.get<Record<string, StorageConfig>>('storages') ?? [];
    const mode = this.c.get<string>('mode')! as 'app' | 'migration';

    const waiter = Object.entries(storeConfigs).map(async ([name, config]) => {
      const token = this.mapping[name.toUpperCase()];
      const client = this.moduleRef.get<StorageService>(token, {
        strict: false,
      });
      const timeout =
        mode === 'migration' ? config.migration.timeout : config.dev.timeout;

      let count = 0;
      while (count < timeout) {
        try {
          await client.minio.listBuckets();
          this.logger.info(`connected to store ${name}`);
          return;
        } catch (e) {
          console.error(e);
          await delay(1000);
          this.logger.info(
            `waiting for store '${name}' to connect, attempt:`,
            count,
          );
          count++;
        }
      }
      throw new Error(`failed to connect to store '${name}'`);
    });
    await Promise.all(waiter);
  }
}

export { StorageMigrator };
