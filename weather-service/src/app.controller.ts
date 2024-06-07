import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ping } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  ping(): Ping {
    return this.appService.ping();
  }
}
