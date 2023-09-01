import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DevConfig } from './storage/dev.config';
import { MigrationConfig } from './storage/migration.config';
import { ConnectionConfig } from './storage/connection.config';

export class StorageConfig {
  @ValidateNested()
  @Type(() => DevConfig)
  dev!: DevConfig;

  @ValidateNested()
  @Type(() => MigrationConfig)
  migration!: MigrationConfig;

  @ValidateNested()
  @Type(() => ConnectionConfig)
  connection!: ConnectionConfig;
}
