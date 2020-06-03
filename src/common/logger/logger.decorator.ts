import { Inject } from '@nestjs/common';

export const namesForLoggers: string[] = [];

// decorator function should be called with great letters
/* tslint:disable-next-line: function-name */
export function Logger(name: string = '') {
  if (!namesForLoggers.includes(name)) {
    namesForLoggers.push(name);
  }

  return Inject(`LoggerService${name}`);
}
