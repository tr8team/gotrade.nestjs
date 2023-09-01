import { Type } from 'class-transformer';
import { IsIn, IsString, ValidateNested } from 'class-validator';
import { AppConfig } from './root/app.config';
import { DatabaseConfig } from './root/database.config';
import { HostConfig } from './root/host.config';
import { CacheConfig } from './root/cache.config';
import { StorageConfig } from './root/storage.config';
import { OtelConfig } from './root/otel.config';

export class RootConfig {
  @IsString()
  @IsIn(['app', 'migration'])
  mode!: 'app' | 'migration';

  //--remove start--
  @IsString()
  secret!: string;
  //--remove end--

  @ValidateNested()
  @Type(() => AppConfig)
  app!: AppConfig;

  @ValidateNested()
  @Type(() => HostConfig)
  host!: HostConfig;

  @ValidateNested()
  @Type(() => OtelConfig)
  otel!: OtelConfig;

  @ValidateNested({
    each: true,
  })
  @Type(() => DatabaseConfig)
  databases!: { [s: string]: DatabaseConfig };

  @ValidateNested({
    each: true,
  })
  @Type(() => CacheConfig)
  caches!: { [s: string]: CacheConfig };

  @ValidateNested({
    each: true,
  })
  @Type(() => StorageConfig)
  storages!: { [s: string]: StorageConfig };
}
