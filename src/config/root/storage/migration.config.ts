import { IsBoolean, IsInt } from 'class-validator';

export class MigrationConfig {
  @IsBoolean()
  autoSeed!: boolean;

  @IsBoolean()
  autoMigrate!: boolean;

  @IsInt()
  timeout!: number;
}
