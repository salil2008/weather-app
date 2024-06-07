import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { HttpModule } from '@nestjs/axios';
import { RestLoggerMiddleware } from './rest-logger.middleware';

@Module({
  imports: [HttpModule],
  exports: [ApiService],
  providers: [ApiService],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RestLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
