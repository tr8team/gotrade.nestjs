import { DynamicModule, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/root/database.config';

@Module({})
export class OrmModule {
  static register(contextName: string): DynamicModule {
    return {
      module: OrmModule,
      imports: [
        MikroOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (c: ConfigService) => {
            const config = c.get<Record<string, DatabaseConfig>>('databases');
            if (config == null) throw new Error('Database config not found');
            const dbConfig = config[contextName];
            if (dbConfig == null)
              throw new Error(
                `Database config for context ${contextName} not found`,
              );
            const {
              orm,
              connection: { database, ...conn },
              driverOptions,
            } = dbConfig;

            return {
              registerRequestContext: false,
              dbName: database,
              ...JSON.parse(JSON.stringify({ ...orm, ...conn })),
              driverOptions,
            };
          },
          inject: [ConfigService],
          contextName,
        }),
      ],
    };
  }
}
