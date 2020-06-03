import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheckController {
  @Get('check')
  public check() {
    return true;
  }
}
