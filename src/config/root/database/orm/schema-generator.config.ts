import { IsBoolean } from 'class-validator';

export class SchemaGeneratorConfig {
  @IsBoolean()
  disableForeignKeys!: boolean;
}
