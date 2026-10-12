import { AdminRole } from '@app/common';

export interface AdminAuthPayload {
  sub: string;
  tokenId: string;
  email: string;
  role: AdminRole;
  name: string;
}

export interface UserAuthPayload {
  sub: string;
  tokenId: string;
  email: string;
  name: string;
}
