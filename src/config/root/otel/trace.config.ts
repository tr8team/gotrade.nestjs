import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExporterConfig } from './trace/exporter.config';

export class TraceConfig {
  @ValidateNested()
  @Type(() => ExporterConfig)
  exporter!: ExporterConfig;
}
