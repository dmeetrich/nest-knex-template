import { DynamicModule, Provider } from '@nestjs/common';

import { namesForLoggers } from './logger.decorator';
import { RootLoggerService } from './root-logger.service';
import { logger, LoggerType } from './logger';

function createLoggerProvider(name: string): Provider<LoggerType> {
  return {
    provide: `LoggerService${name}`,
    useValue: logger.child({ name, level: process.env.APP_LOG_LEVEL }),
  };
}

export function createLoggerProviders(): Provider<LoggerType>[] {
  return namesForLoggers.map(createLoggerProvider);
}

export class LoggerModule {
  static forRoot(): DynamicModule {
    const loggerProviders = createLoggerProviders();

    return {
      module: LoggerModule,
      providers: [RootLoggerService, ...loggerProviders],
      exports: [RootLoggerService, ...loggerProviders],
    };
  }
}
