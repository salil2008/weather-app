import { Injectable } from '@nestjs/common';
import { Ping } from './types';

@Injectable()
export class AppService {
  ping(): Ping {
    return {
      status: 'SUCCESS',
      message: 'Service running',
      date: new Date(),
    };
  }
}
