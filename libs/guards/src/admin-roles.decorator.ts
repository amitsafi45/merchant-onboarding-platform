import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '@app/common';

export const AdminRoles = (...roles: AdminRole[]) =>
  SetMetadata('admin_roles', roles);
