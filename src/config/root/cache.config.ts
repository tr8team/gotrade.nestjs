import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DevConfig } from './cache/dev.config';
import { MigrationConfig } from './cache/migration.config';
import { ConnectionConfig } from './cache/connection.config';

export class CacheConfig {
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
