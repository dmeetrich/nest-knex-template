import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { JoiValidationPipe } from '@common/pipes/joi-validation.pipe';
import { Controller, Get, HttpStatus, Query, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as joi from 'joi';

import { GetUser } from './user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(['admin'])
  @ApiTags('admin')
  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({
    description: 'Get users list',
    summary: 'This endpoint return users',
  })
  @ApiResponse({
    description: 'Return users',
    status: HttpStatus.OK,
  })
  @UsePipes(
    new JoiValidationPipe({
      limit: joi
        .number()
        .positive()
        .integer(),
      offset: joi.number().integer(),
      role: joi.string().allow(['admin', 'manager', 'employee']),
    }),
  )
  async getUserList(@Query() query: GetUser) {
    return this.userService.getUserList(query);
  }
}
