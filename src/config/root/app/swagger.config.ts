import { IsString } from 'class-validator';

export class SwaggerConfig {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  version!: string;
}
