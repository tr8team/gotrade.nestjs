import { IsNumber, IsString, Max, Min } from 'class-validator';

export class HostConfig {
  @IsString()
  host!: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  port!: number;
}
