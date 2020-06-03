import { LoggerService as CommonLoggerService } from '@nestjs/common';

import { logger, LoggerType } from './logger';

export class RootLoggerService implements CommonLoggerService {
  private logger: LoggerType;

  constructor() {
    this.logger = logger.child({ level: process.env.ROOT_LOG_LEVEL });
  }

  error(message: string, trace: string, name?: string) {
    this.logger.error({ trace, name }, message);
  }

  warn(message: string, name?: string) {
    this.logger.warn({ name }, message);
  }

  log(message: string, name?: string) {
    this.logger.info({ name }, message);
  }

  debug(message: string, name?: string) {
    this.logger.debug({ name }, message);
  }

  verbose(message: string, name?: string) {
    this.logger.trace({ name }, message);
  }
}
