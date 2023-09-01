import { IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SwaggerConfig } from './app/swagger.config';

export class AppConfig {
  @ValidateNested()
  @Type(() => SwaggerConfig)
  swagger!: SwaggerConfig;

  @IsString()
  @MinLength(1)
  landscape!: string;

  @IsString()
  @MinLength(1)
  platform!: string;

  @IsString()
  @MinLength(1)
  service!: string;

  @IsString()
  @MinLength(1)
  designation!: string;
}
