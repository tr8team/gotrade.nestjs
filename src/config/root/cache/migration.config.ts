import { IsBoolean } from 'class-validator';

export class MigrationConfig {
  @IsBoolean()
  autoSeed!: boolean;
}
