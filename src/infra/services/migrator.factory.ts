import { INestApplicationContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheMigrator } from './cache.migrator';
import { ICacheSeeder } from '../../../seeders/CacheSeeder';
import { IMigrator } from './migrator.interface';
import { DatabaseMigrator } from './database.migrator';
import { Constructor } from '@mikro-orm/core/typings';
import { Seeder } from '@mikro-orm/seeder';
import { StorageMigrator } from './storage.migrator';
import { IStorageSeeder } from '../../../seeders/StorageSeeder';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
class MigratorFactory {
  constructor(
    private readonly c: ConfigService,
    private readonly logger: PinoLogger,
  ) {}

  CreateCache(
    moduleRef: INestApplicationContext,
    mapping: Record<string, symbol>,
    seeders: Record<symbol, ICacheSeeder | null | undefined>,
  ): IMigrator {
    return new CacheMigrator(this.c, moduleRef, mapping, seeders, this.logger);
  }

  CreateDatabase(
    moduleRef: INestApplicationContext,
    seeders: Record<string, Constructor<Seeder> | null | undefined>,
  ): IMigrator {
    return new DatabaseMigrator(this.c, moduleRef, seeders, this.logger);
  }

  CreateStorage(
    moduleRef: INestApplicationContext,
    mapping: Record<string, symbol>,
    seeders: Record<symbol, IStorageSeeder | null | undefined>,
  ): IMigrator {
    return new StorageMigrator(
      this.c,
      moduleRef,
      mapping,
      seeders,
      this.logger,
    );
  }
}

export { MigratorFactory };
