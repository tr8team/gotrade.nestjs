import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OtlpConfig } from './exporter/otlp.config';

export class ExporterConfig {
  @IsIn(['console', 'otlp', 'none'])
  use!: 'console' | 'otlp' | 'none';

  @IsOptional()
  @ValidateNested()
  @Type(() => OtlpConfig)
  otlp?: OtlpConfig;
}
