import { IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExporterConfig } from './metrics/exporter.config';
import { ApiConfig } from './metrics/api.config';

export class MetricsConfig {
  @ValidateNested()
  @Type(() => ExporterConfig)
  exporter!: ExporterConfig;

  @IsBoolean()
  hostMetrics!: boolean;

  @ValidateNested()
  @Type(() => ApiConfig)
  api!: ApiConfig;
}
