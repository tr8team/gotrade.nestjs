import { IsBoolean, IsInt } from 'class-validator';

export class DevConfig {
  @IsBoolean()
  autoSeed!: boolean;

  @IsBoolean()
  autoMigrate!: boolean;

  @IsInt()
  timeout!: number;
}
