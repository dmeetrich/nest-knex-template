import { LoggerModule } from '@common/logger';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  exports: [UserService],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    LoggerModule.forRoot(),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
