import { JoiValidationPipe } from '@common/pipes/joi-validation.pipe';
import { Body, Controller, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as config from 'config';
import * as joi from 'joi';

import { GetUserResponseDto } from '../user/user.dto';
import { AuthService } from './auth.service';
import { SignInDto, SignInResponseDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

const { defaultPasswordLength } = config.get('password');

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    description: 'Sign up',
  })
  @ApiResponse({
    description: 'The user has been successfully created.',
    status: HttpStatus.OK,
    type: GetUserResponseDto,
  })
  @ApiResponse({
    description: 'Validation error or user already exists.',
    status: HttpStatus.BAD_REQUEST,
  })
  @UsePipes(
    new JoiValidationPipe({
      email: joi
        .string()
        .email()
        .lowercase()
        .required(),
      firstName: joi
        .string()
        .max(20)
        .required(),
      secondName: joi
        .string()
        .max(20)
        .required(),
      password: joi
        .string()
        .min(defaultPasswordLength)
        .required(),
    }),
  )
  signUp(
    @Body()
    signUpData: SignUpDto,
  ) {
    return this.authService.signUp(signUpData);
  }

  @Post('signin')
  @ApiOperation({
    description: 'Sign in',
  })
  @ApiResponse({
    description: 'The user was authenticated.',
    status: HttpStatus.OK,
    type: SignInResponseDto,
  })
  @ApiResponse({
    description: "Validation error or user doesn't exist or password is invalid.",
    status: HttpStatus.BAD_REQUEST,
  })
  @UsePipes(
    new JoiValidationPipe({
      email: joi
        .string()
        .email()
        .lowercase()
        .required(),
      password: joi.string().required(),
    }),
  )
  signIn(@Body() signInData: SignInDto) {
    return this.authService.signIn(signInData);
  }
}
