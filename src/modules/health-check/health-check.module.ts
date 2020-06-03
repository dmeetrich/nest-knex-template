import { Module } from '@nestjs/common';

import { HealthCheckController } from './health-check.controller';

@Module({
  controllers: [HealthCheckController],
  exports: [],
  providers: [],
})
export class HealthCheckModule {}
