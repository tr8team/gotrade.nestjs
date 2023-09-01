import { INestApplication } from '@nestjs/common';
import { Constructor } from '@mikro-orm/core/typings';
import { Seeder } from '@mikro-orm/seeder';
import { getMikroORMToken } from '@mikro-orm/nestjs';
import Redis from 'ioredis';
import { ICacheSeeder } from '../../seeders/CacheSeeder';
import { IStorageSeeder } from '../../seeders/StorageSeeder';
import { StorageService } from '../../src/infra/services/storage.service';

async function setupDatabase(
  app: INestApplication,
  context: string,
  seed?: Constructor<Seeder>,
) {
  const mainOrm = app.get(getMikroORMToken(context));

  await mainOrm.getSchemaGenerator().refreshDatabase();
  if (seed) {
    const seeder = mainOrm.getSeeder();
    await seeder.seed(seed);
  }
}

async function setupCache(
  app: INestApplication,
  context: symbol,
  seed?: ICacheSeeder,
) {
  const cache = app.get<Redis>(context);

  await cache.flushall();
  if (seed) {
    await seed.seed(cache);
  }
}

async function setupStorage(
  app: INestApplication,
  context: symbol,
  seed?: IStorageSeeder,
) {
  const store = app.get<StorageService>(context);

  try {
    await store.minio.removeBucket(store.bucket);
  } catch {}
  try {
    await store.minio.removeBucket(store.bucket);
  } catch {}
  if (seed) {
    await seed.seed(store);
  }
}

export { setupDatabase, setupCache, setupStorage };
