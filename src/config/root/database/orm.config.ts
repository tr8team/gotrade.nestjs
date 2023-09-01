import { IsString, ValidateNested } from 'class-validator';
import { MigrationConfig } from './orm/migration.config';
import { SeederConfig } from './orm/seeder.config';
import { Type } from 'class-transformer';
import { SchemaGeneratorConfig } from './orm/schema-generator.config';

export class OrmConfig {
  @IsString({ each: true })
  entities!: string[];

  @IsString({ each: true })
  entitiesTs!: string[];

  @ValidateNested()
  @Type(() => MigrationConfig)
  migrations!: MigrationConfig;

  @ValidateNested()
  @Type(() => SeederConfig)
  seeder!: SeederConfig;

  @ValidateNested()
  @Type(() => SchemaGeneratorConfig)
  schemaGenerator!: SchemaGeneratorConfig;
}
