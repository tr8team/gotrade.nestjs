import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ConnectionConfig {
  @IsString()
  endpoint!: string;

  @MaxLength(64)
  bucket!: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  port?: number;

  @IsBoolean()
  @IsOptional()
  useSSL?: boolean;

  @IsString()
  access!: string;

  @IsString()
  secret!: string;
}
