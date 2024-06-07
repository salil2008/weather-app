import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import * as chalk from 'chalk';

@Injectable()
export class RestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('RestLoggerMiddleware');
  use(req: any, res: any, next: () => void) {
    this.logger.log(
      `[${chalk.white(req.method)}] ${chalk.cyan(res.statusCode.toString())} ` +
        `${chalk.white('|')} ${chalk.cyan(req.httpVersion)} ${chalk.white('|')} ${chalk.cyan(req.ip)} ` +
        `[${chalk.white('route:', req.path)}]`,
    );
    next();
  }
}
