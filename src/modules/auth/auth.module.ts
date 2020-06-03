import { LoggerModule } from '@common/logger';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const { jwtSecret } = config.get('jwt');

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: jwtSecret,
    }),
    UserModule,
    LoggerModule.forRoot(),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
