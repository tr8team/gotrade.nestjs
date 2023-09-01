import { IsBoolean, IsString } from 'class-validator';

export class LoggingConfig {
  @IsBoolean()
  enableAutoAPILogging!: boolean;

  @IsString()
  level!: string;

  @IsBoolean()
  prettify!: boolean;
}
