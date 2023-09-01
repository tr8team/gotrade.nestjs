import { IsBoolean } from 'class-validator';

export class DevConfig {
  @IsBoolean()
  autoSeed!: boolean;
}
