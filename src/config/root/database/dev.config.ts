import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class DevConfig {
  @IsBoolean()
  autoMigrate!: boolean;

  @IsBoolean()
  autoSeed!: boolean;

  @IsNumber()
  @IsPositive()
  timeout!: number;
}
