import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    if (user?.role !== 'admin') {
      throw new ForbiddenException('Hanya admin yang dapat mengakses halaman ini!');
    }

    return true;
  }
}
