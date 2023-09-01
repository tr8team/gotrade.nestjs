import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ConnectionConfig {
  @IsString()
  host!: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  port!: number;

  @IsOptional()
  @IsBoolean()
  tls?: boolean;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  keyPrefix?: string;

  @IsBoolean()
  autoResubscribe!: boolean;

  @IsInt()
  @IsPositive()
  connectTimeout!: number;

  @IsInt()
  @IsPositive()
  commandTimeout!: number;

  @IsBoolean()
  enableAutoPipelining!: boolean;

  @IsBoolean()
  readOnly!: boolean;
}
