import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import { has, pipe, prop } from 'ramda';
import { Observable } from 'rxjs';

const API_KEY: string = config.get('apiAccess.apiKey');
const API_KEY_HEADER_NAME: string = 'x-api-key' as const;

const hasApiKeyHeader = pipe(prop('headers'), has(API_KEY_HEADER_NAME));

const validateRequest = (request: Request) => {
  if (!hasApiKeyHeader(request)) {
    throw new UnauthorizedException('X-API-KEY header is missing');
  }

  if (request.headers[API_KEY_HEADER_NAME] === API_KEY) {
    return true;
  }

  throw new UnauthorizedException('Provided API key is not valid');
};

@Injectable()
export class ApiAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    return validateRequest(request);
  }
}
