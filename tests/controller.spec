import { describe, should } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../../../src/app.module.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { setupDatabase, Theory } from '../../../helper';
import { contexts } from '../../../../../src/constants';
import { InjectOptions } from 'light-my-request';
import { PersonTestSeeder } from '../../../../../seeders/database/main/PersonTestSeeder';
import {
  PersonPrincipalRes,
  PersonRes,
} from '../../../../../src/sample/adapters/api/v1/dto/person.res';
import { CreatePersonReq } from '../../../../../src/sample/adapters/api/v1/dto/person.req';

should();

describe('PersonController', () => {
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
      setupDatabase(app, contexts.MAIN, PersonTestSeeder),
    ]);
    await setups;
  });

  describe('/api/v1/person (GET)', () => {
    it('should return all person', async () => {
      const subj: InjectOptions = {
        method: 'GET',
        url: '/api/v1/person',
      };

      const ex: PersonPrincipalRes[] = [
        {
          id: '52c6a5ee-55be-493b-9b87-2a951d5632f2',
          name: 'John Doe',
          age: 30,
          dob: '1990-01-01',
          email: 'ern@gmail.com',
          open: '12:12:12',
          now: '2021-01-01T12:12:12Z',
          twitter: 'https://google.com',
          random: '97124188-9d58-444b-ac66-84b8a3cbf1fa',
          verified: false,
        },
        {
          id: '21fe29b2-1ffe-4ea9-aaeb-8c808c54e497',
          name: 'John Doe 2',
          age: 30,
          dob: '1990-01-01',
          email: 'ern@gmail.com',
          open: '12:12:12',
          now: '2021-01-01T12:12:12Z',
          twitter: 'https://google.com',
          random: '97124188-9d58-444b-ac66-84b8a3cbf1fa',
          verified: false,
        },
        {
          id: '37f4b420-2efd-49be-b112-abffce00b72c',
          name: 'John Doe 3',
          age: 30,
          dob: '1990-01-01',
          email: 'ern@gmail.com',
          open: '12:12:12',
          now: '2021-01-01T12:12:12Z',
          twitter: 'https://google.com',
          random: '97124188-9d58-444b-ac66-84b8a3cbf1fa',
          verified: false,
        },
      ];

      const actual = await app.inject(subj);
      actual.statusCode.should.eq(200);
      JSON.parse(actual.payload).should.deep.eq(ex);
    });
  });

  describe('/api/v1/person/:id (GET)', async () => {
    const existTheory: Theory<string, PersonRes>[] = [
      {
        subj: '52c6a5ee-55be-493b-9b87-2a951d5632f2',
        ex: {
          principal: {
            name: 'John Doe',
            age: 30,
            dob: '1990-01-01',
            email: 'ern@gmail.com',
            open: '12:12:12',
            now: '2021-01-01T12:12:12Z',
            twitter: 'https://google.com',
            random: '97124188-9d58-444b-ac66-84b8a3cbf1fa',
            verified: false,
            id: '52c6a5ee-55be-493b-9b87-2a951d5632f2',
          },
        },
      },
      {
        subj: '21fe29b2-1ffe-4ea9-aaeb-8c808c54e497',
        ex: {
          principal: {
            id: '21fe29b2-1ffe-4ea9-aaeb-8c808c54e497',
            name: 'John Doe 2',
            age: 30,
            dob: '1990-01-01',
            email: 'ern@gmail.com',
            open: '12:12:12',
            now: '2021-01-01T12:12:12Z',
            twitter: 'https://google.com',
            random: '97124188-9d58-444b-ac66-84b8a3cbf1fa',
            verified: false,
          },
        },
      },
      {
        subj: '37f4b420-2efd-49be-b112-abffce00b72c',
        ex: {
          principal: {
            id: '37f4b420-2efd-49be-b112-abffce00b72c',
            name: 'John Doe 3',
            age: 30,
            dob: '1990-01-01',
            email: 'ern@gmail.com',
            open: '12:12:12',
            now: '2021-01-01T12:12:12Z',
            twitter: 'https://google.com',
            random: '97124188-9d58-444b-ac66-84b8a3cbf1fa',
            verified: false,
          },
        },
      },
    ];

    existTheory.forEach(({ subj, ex }) => {
      it(`should return if person '${subj}' exist`, async () => {
        const s: InjectOptions = {
          method: 'GET',
          url: `/api/v1/person/${subj}`,
        };
        const actual = await app.inject(s);
        actual.statusCode.should.eq(200);
        JSON.parse(actual.payload).should.deep.eq(ex);
      });
    });

    const notExistTheory: Theory<
      string,
      { message: string; statusCode: number }
    >[] = [
      {
        subj: 'ec5e0ea0-2343-49a4-b13e-d6604ef733a6',
        ex: {
          message: 'Person not found',
          statusCode: 404,
        },
      },
      {
        subj: 'ba8f2474-57f9-4b32-ae2b-cde53a42d520',
        ex: {
          message: 'Person not found',
          statusCode: 404,
        },
      },
      {
        subj: 'b43ba373-fd1e-4f4c-8eed-3c7bbacb0d65',
        ex: {
          message: 'Person not found',
          statusCode: 404,
        },
      },
    ];
    notExistTheory.forEach(({ subj, ex }) => {
      it(`should return 404 error if person '${subj}' does not exist`, async () => {
        const s: InjectOptions = {
          method: 'GET',
          url: `/api/v1/person/${subj}`,
        };
        const actual = await app.inject(s);
        actual.statusCode.should.eq(404);
        JSON.parse(actual.payload).should.deep.eq(ex);
      });
    });
  });

  describe('/api/v1/person/:id (POST)', async () => {
    const theory: Theory<CreatePersonReq, PersonPrincipalRes>[] = [
      {
        subj: {
          name: 'Presley',
          age: 30,
          dob: '2023-08-09',
          email: 'Wellington.Kertzmann@hotmail.com',
          open: '23:10:29',
          now: '2023-09-01T10:50:10Z',
          twitter: 'http://unlawful-screw-up.info',
          random: '6e3eea08-ebbc-44ca-9f0e-e4c36e3eb854',
          verified: false,
        },
        ex: {
          name: 'Presley',
          age: 30,
          dob: '2023-08-09',
          email: 'Wellington.Kertzmann@hotmail.com',
          open: '23:10:29',
          now: '2023-09-01T10:50:10Z',
          twitter: 'http://unlawful-screw-up.info',
          random: '6e3eea08-ebbc-44ca-9f0e-e4c36e3eb854',
          verified: false,
          id: '52c6a5ee-55be-493b-9b87-2a951d5632f2',
        },
      },
      {
        subj: {
          name: 'Annabel',
          age: 30,
          dob: '1983-01-02',
          email: 'Rosella7@yahoo.com',
          open: '01:01:20',
          now: '2003-01-12T11:32:20Z',
          twitter: 'http://vengeful-brunch.biz',
          random: '99906a2c-f04a-46f3-b10b-3fd37b73f5ae',
          verified: false,
        },
        ex: {
          name: 'Annabel',
          age: 30,
          dob: '1983-01-02',
          email: 'Rosella7@yahoo.com',
          open: '01:01:20',
          now: '2003-01-12T11:32:20Z',
          twitter: 'http://vengeful-brunch.biz',
          random: '99906a2c-f04a-46f3-b10b-3fd37b73f5ae',
          verified: false,
          id: '52c6a5ee-55be-493b-9b87-2a951d5632f2',
        },
      },
    ];

    theory.forEach(({ subj, ex }, i) => {
      it(`should return 200 and the created person case ${i}`, async () => {
        const s: InjectOptions = {
          method: 'POST',
          url: `/api/v1/person`,
          payload: subj,
        };
        const actual = await app.inject(s);
        console.log(actual.payload);
        actual.statusCode.should.eq(200);
        const exp = {
          ...ex,
          id: JSON.parse(actual.payload).id,
        };
        JSON.parse(actual.payload).should.deep.eq(exp);
      });
    });
  });
});
