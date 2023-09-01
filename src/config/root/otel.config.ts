import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LoggingConfig } from './otel/logging.config';
import { MetricsConfig } from './otel/metrics.config';
import { TraceConfig } from './otel/trace.config';

export class OtelConfig {
  @ValidateNested()
  @Type(() => LoggingConfig)
  logging!: LoggingConfig;

  @ValidateNested()
  @Type(() => MetricsConfig)
  metrics!: MetricsConfig;

  @ValidateNested()
  @Type(() => TraceConfig)
  trace!: TraceConfig;
}
