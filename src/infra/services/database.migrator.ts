import { IMigrator } from './migrator.interface';
import { ConfigService } from '@nestjs/config';
import { INestApplicationContext } from '@nestjs/common';
import { delay } from '../util';
import { Constructor, Seeder } from '@mikro-orm/core/typings';
import { DatabaseConfig } from '../../config/root/database.config';
import { MikroORM } from '@mikro-orm/core';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import { PinoLogger } from 'nestjs-pino';

class DatabaseMigrator implements IMigrator {
  constructor(
    private readonly c: ConfigService,
    private readonly moduleRef: INestApplicationContext,
    private readonly seeders: Record<
      string,
      Constructor<Seeder> | null | undefined
    >,
    private readonly logger: PinoLogger,
  ) {}

  async migrate(): Promise<void> {
    const db = this.c.get<Record<string, DatabaseConfig>>('databases') ?? [];
    const config = this.c.get<string>('mode')! as 'app' | 'migration';

    const migrations = Object.entries(db).map(async ([name, dbConfig]) => {
      const orm = this.moduleRef.get<MikroORM>(getMikroORMToken(name), {
        strict: false,
      });

      if (
        (config === 'migration' && dbConfig.migration.migrate) ||
        (config === 'app' && dbConfig.dev.autoMigrate)
      ) {
        this.logger.info("start migrating database '%s'", name);
        try {
          await orm.getSchemaGenerator().createSchema();
        } catch (e) {
          await orm.getSchemaGenerator().updateSchema();
        }
      }
      if (
        (config === 'migration' && dbConfig.migration.seed) ||
        (config === 'app' && dbConfig.dev.autoSeed)
      ) {
        this.logger.info("start seeding database '%s'", name);
        try {
          const seed = this.seeders[name];
          if (seed) await orm.seeder.seed(seed);
        } catch (e) {}
      }
    });
    await Promise.all(migrations);
  }

  async wait(): Promise<void> {
    const db = this.c.get<Record<string, DatabaseConfig>>('databases') ?? {};
    const config = this.c.get<string>('mode')! as 'app' | 'migration';

    const waiter = Object.entries(db).map(async ([name, dbConfig]) => {
      const orm = this.moduleRef.get<MikroORM>(getMikroORMToken(name), {
        strict: false,
      });
      let count = 0;
      const timeout =
        config === 'migration'
          ? dbConfig.migration.timeout
          : dbConfig.dev.timeout;
      while (count < timeout) {
        const connected = await orm.isConnected();
        if (connected) {
          this.logger.info("connected to database '%s'", name);
          return;
        }
        await delay(1000);
        this.logger.info(
          "waiting for database '%s' to connect, attempt: '%s'",
          name,
          count,
        );
        count++;
      }
      throw new Error(`failed to connect to database '${name}'`);
    });
    await Promise.all(waiter);
  }
}

export { DatabaseMigrator };
