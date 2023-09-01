import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OtlpConfig } from './exporter/otlp.config';

export class ExporterConfig {
  @IsIn(['console', 'otlp', 'none'])
  use!: 'console' | 'otlp' | 'none';

  @IsNumber()
  @IsPositive()
  interval!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => OtlpConfig)
  otlp?: OtlpConfig;
}
