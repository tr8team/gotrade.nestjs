import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  get(): { status: string } {
    return { status: 'ok2' };
  }
}
