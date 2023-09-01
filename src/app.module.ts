import { Module } from '@nestjs/common';
import { MigrationModule } from './infra/migration.module';
//--remove start--
import { BlogModule } from './blog/blog.module';
//--remove end--
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { OpenTelemetryModule } from 'nestjs-otel';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MetricsConfig } from './config/root/otel/metrics.config';

@Module({
  imports: [
    MigrationModule,
    FastifyMulterModule.register({}),

    // modules
    //--remove start--
    BlogModule,
    //--remove end--
    MikroOrmModule.forMiddleware(),

    OpenTelemetryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const c = config.get<MetricsConfig>('otel.metrics');
        if (c == null) throw new Error('otel.metrics is not defined');
        return {
          metrics: {
            hostMetrics: c.hostMetrics,
            apiMetrics: {
              enable: c.api.enable,
              defaultAttributes: c.api.defaultAttributes,
              ignoreRoutes: c.api.ignoreRoutes,
              ignoreUndefinedRoutes: c.api.ignoreUndefinedRoutes,
            },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
