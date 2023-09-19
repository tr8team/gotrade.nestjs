import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/root/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HostConfig } from './config/root/host.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MigrationModule } from './infra/migration.module';
import {
  dbSeeders,
  redis,
  redisSeeders,
  stores,
  storeSeeders,
} from './constants';
import { MigratorFactory } from './infra/services/migrator.factory';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

function loadSwagger(
  app: INestApplication,
  configService: ConfigService,
): INestApplication {
  const cfg = configService.get<AppConfig>('app')!;
  const config = new DocumentBuilder()
    .setTitle(cfg.swagger.title)
    .setDescription(cfg.swagger.description)
    .setVersion(cfg.swagger.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  return app;
}

async function bootstrap(): Promise<[INestApplication, HostConfig]> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
    {
      bufferLogs: true,
    },
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
    ],
  });
  const configService = app.get(ConfigService);
  const hostConfig = configService.get<HostConfig>('host')!;
  return [loadSwagger(app, configService), hostConfig];
}

async function wait() {
  const waiter = await NestFactory.createApplicationContext(MigrationModule, {
    bufferLogs: true,
  });
  await waiter.init();
  waiter.useLogger(waiter.get(Logger));
  const fact = await waiter.resolve(MigratorFactory);
  const cache = fact.CreateCache(waiter, redis, redisSeeders);
  const db = fact.CreateDatabase(waiter, dbSeeders);
  const store = fact.CreateStorage(waiter, stores, storeSeeders);
  await Promise.all([db, cache, store].map(x => x.wait()));
  waiter.flushLogs();
  await waiter.close();
}

async function migrate() {
  const migration = await NestFactory.createApplicationContext(
    MigrationModule,
    {
      bufferLogs: true,
    },
  );
  await migration.init();
  migration.useLogger(migration.get(Logger));
  const fact = await migration.resolve(MigratorFactory);
  const cache = fact.CreateCache(migration, redis, redisSeeders);
  const db = fact.CreateDatabase(migration, dbSeeders);
  const store = fact.CreateStorage(migration, stores, storeSeeders);
  await Promise.all([db, cache, store].map(x => x.migrate()));
  migration.flushLogs();
  await migration.close();
}

export { bootstrap, migrate, wait };
