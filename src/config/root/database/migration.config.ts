import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class MigrationConfig {
  @IsBoolean()
  migrate!: boolean;

  @IsBoolean()
  seed!: boolean;

  @IsNumber()
  @IsPositive()
  timeout!: number;
}
