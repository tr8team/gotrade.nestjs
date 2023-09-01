import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageConfig } from '../config/root/storage.config';
import { Client } from 'minio';
import { StorageService } from './services/storage.service';

@Module({})
export class StorageModule {
  static async register(
    context: string,
    storages: Record<string, symbol>,
  ): Promise<DynamicModule> {
    return {
      module: StorageModule,
      global: true,
      providers: [
        {
          provide: storages[context.toUpperCase()],
          inject: [ConfigService],
          useFactory: async (c: ConfigService) => {
            const configs =
              c.get<Record<string, StorageConfig>>('storages') ?? {};
            const config = configs[context];
            const {
              connection: { bucket, endpoint, access, secret, ...conn },
            } = config;

            const client = new Client({
              ...conn,
              accessKey: access,
              secretKey: secret,
              endPoint: endpoint,
            });

            return new StorageService(client, bucket);
          },
        },
      ],
      exports: [storages[context.toUpperCase()]],
    };
  }
}
