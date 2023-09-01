import { IsString } from 'class-validator';

export class SeederConfig {
  @IsString()
  path!: string;
}
