import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@app/common';
import { AdminAuthPayload } from '@app/guards';

@Injectable()
export class AdminAuthorization implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ admin: AdminAuthPayload }>();

    const admin = request.admin;

    if (!admin) {
      throw new ForbiddenException('Access denied');
    }

    if (admin.role === AdminRole.ADMIN) {
      return true;
    }

    const allowedRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      'admin_roles',
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles?.includes(admin.role as AdminRole)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
