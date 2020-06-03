import { Module } from '@nestjs/common';
import { KnexModule } from '@nestjsplus/knex';
import * as config from 'config';

import { LoggerModule } from './common/logger';
import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';

const knexConfig = config.get('knex');

@Module({
  imports: [LoggerModule.forRoot(), KnexModule.register(knexConfig), AuthModule, HealthCheckModule],
})
export class AppModule {}
