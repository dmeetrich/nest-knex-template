import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface IRequestUser {
  id: number;
  role: string;
  email: string;
  firstName: string;
  secondName: string;
  isDeleted: boolean;
  addedAt: string;
  updatedAt: string;
}
interface IRequest extends Request {
  user: IRequestUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IRequest>();
    const user = request.user;
    const hasRole = () => roles.includes(user.role);

    return user && user.role && hasRole();
  }
}
