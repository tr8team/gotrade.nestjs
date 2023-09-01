import { describe, should } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../../../src/app.module.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { setupCache, setupDatabase, setupStorage } from '../../../helper';
import { contexts, redis, stores } from '../../../../../src/constants';
import { DatabaseSeeder as DatabaseSeederMain } from '../../../../../seeders/database/main/DatabaseSeeder';
import { InjectOptions } from 'light-my-request';
import { ExampleSeeder } from '../../../../../seeders/cache/main/ExampleSeeder';

should();

describe('BlogController', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.enableVersioning({ type: VersioningType.URI });
    app.setGlobalPrefix('api');

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    const setups = Promise.all([
      setupDatabase(app, contexts.MAIN, DatabaseSeederMain),
      setupCache(app, redis.MAIN, new ExampleSeeder()),
      setupStorage(app, stores.MAIN),
    ]);
    await setups;
  });

  it('/api/v1/blogs (GET)', async () => {
    const subj: InjectOptions = {
      method: 'GET',
      url: '/api/v1/blogs',
    };

    const ex = [
      {
        id: '52c6a5ee-55be-493b-9b87-2a951d5632f2',
        text: "I'm a blog post!",
        tags: ['blog', 'post'],
      },
    ];

    const actual = await app.inject(subj);
    actual.statusCode.should.eq(200);
    actual.payload.should.eq(JSON.stringify(ex));
  });

  it('/api/v1/blogs/test/:id (GET)', async () => {
    const subj: InjectOptions = {
      method: 'GET',
      url: '/api/v1/blogs/test/hello',
    };

    const ex = 'world';

    const actual = await app.inject(subj);
    actual.statusCode.should.eq(200);
    actual.payload.should.eq(ex);
  });

  it('/api/v1/blogs/secret (GET)', async () => {
    const subj: InjectOptions = {
      method: 'GET',
      url: '/api/v1/blogs/secret',
    };

    const ex = 'testestest~!';

    const actual = await app.inject(subj);
    actual.statusCode.should.eq(200);
    actual.payload.should.eq(ex);
  });
});
