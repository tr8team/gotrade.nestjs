import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loader from '../config/loader';
import { dbModules, redisModules, storeModules } from '../constants';
import { MigratorFactory } from './services/migrator.factory';
import { LoggerModule } from 'nestjs-pino';
import { LoggingConfig } from '../config/root/otel/logging.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loader],
      ignoreEnvFile: true,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),

    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const cfg = config.get<LoggingConfig>('otel.logging');
        if (cfg == null) throw new Error('otel.logging is not defined');
        return {
          pinoHttp: {
            autoLogging: false,
            level: cfg.level,
            transport: cfg.prettify ? { target: 'pino-pretty' } : undefined,
          },
          exclude: [{ method: RequestMethod.ALL, path: '/' }],
        };
      },
    }),
    ...dbModules,
    ...storeModules,
    ...redisModules,
  ],
  providers: [MigratorFactory],
})
class MigrationModule {}

export { MigrationModule };
