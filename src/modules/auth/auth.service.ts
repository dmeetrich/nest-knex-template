import { Logger, LoggerType } from '@common/logger';
import { encryptPassword } from '@common/tools';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User, UserRole } from '../user/user.interfaces';
import { UserService } from '../user/user.service';
import { SignInDto, SignInResponseDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Logger('AuthService')
    private readonly logger: LoggerType,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(userData: SignUpDto): Promise<User> {
    this.logger.info(
      {
        email: userData.email,
      },
      'User is signing up',
    );
    const { email, firstName, secondName, password } = userData;
    const isUserExists = await this.userService.isUserExists(email);

    if (isUserExists) {
      throw new HttpException(
        {
          error: 'User already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const encryptedPassword = encryptPassword(password);
    const user = await this.userService
      .createUser({
        email,
        firstName,
        secondName,
        password: encryptedPassword,
      })
      .catch(() => {
        throw new HttpException(
          {
            error: 'User creation failed',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return user;
  }

  public async signIn({ email, password }: SignInDto): Promise<SignInResponseDto> {
    this.logger.info(
      {
        email,
      },
      'User is signing in',
    );
    const encryptedPassword = encryptPassword(password);
    const user = await this.userService.getUserWithRole({
      email,
      password: encryptedPassword,
    });

    if (!user) {
      throw new HttpException(
        {
          error: "User doesn't exist or password is invalid",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.isDeleted) {
      await this.userService.updateUser(user.id, { isDeleted: false });
    }

    const { id, role } = user;

    const token = this.createToken({
      id,
      role,
    });

    return {
      id,
      role,
      token,
    };
  }

  public createToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  public async validateUser(payload: JwtPayload): Promise<UserRole> {
    const { id } = payload;

    return this.userService.getUserWithRole({
      id,
    });
  }
}
