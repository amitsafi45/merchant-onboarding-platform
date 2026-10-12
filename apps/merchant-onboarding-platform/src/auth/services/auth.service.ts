import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginCredentialsDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { AdminAuthPayload, UserAuthPayload } from '@app/guards';
import {
  AdminService,
  AdminTokenService,
  UserService,
  UserTokenService,
} from '@app/typeorm-source';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly userTokenService: UserTokenService,
    private readonly adminTokenService: AdminTokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Authenticates an admin and issues a JWT.
   *
   * Flow:
   * 1. Find the admin by email and validate the password.
   * 2. Load the admin JWT secret and expiration from configuration.
   * 3. Generate a unique token ID and calculate the expiration date.
   * 4. Sign the JWT with the admin details, role, and token ID.
   * 5. Save the generated JWT and its expiration in the database.
   * 6. Return the admin information and Bearer token.
   */
  async adminLogin(credential: LoginCredentialsDto) {
    const admin = await this.adminService.findOneByEmail(credential.email);
    if (!admin) {
      throw new HttpException(
        'Invalid Email Or Password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      credential.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid Email Or Password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const secret = this.configService.getOrThrow<string>(
      'ADMIN_JWT_SCERET_KEY',
    );

    const expiresIn = this.configService.getOrThrow<string>(
      'ADMIN_JWT_EXPIRES_IN',
    ) as `${number}${'s' | 'm' | 'h' | 'd'}`;

    const expiresAt = new Date(
      Date.now() +
        Number(expiresIn.slice(0, -1)) *
          ({
            s: 1_000,
            m: 60_000,
            h: 3_600_000,
            d: 86_400_000,
          }[expiresIn.slice(-1)] ?? 0),
    );
    const tokenId = randomUUID();

    const payload: AdminAuthPayload = {
      sub: admin.id,
      tokenId,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    };

    const accessToken: string = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });

    const savedTokenId = await this.adminTokenService.saveToken({
      id: tokenId,
      adminId: admin.id,
      token: accessToken,
      expiresAt,
    });
    if (!savedTokenId) {
      throw new HttpException(
        'Failed to persist the authentication token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      adminId: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: `Bearer ${accessToken}`,
    };
  }
  /**
   * Authenticates a user and issues a JWT.
   *
   * Flow:
   * 1. Find the user by email and validate the password.
   * 2. Load the JWT secret and expiration from configuration.
   * 3. Generate a unique token ID and calculate the expiration date.
   * 4. Sign the JWT with the user details and token ID.
   * 5. Save the generated JWT and its expiration in the database.
   * 6. Return the user information and Bearer token.
   */
  async userLogin(credential: LoginCredentialsDto) {
    const user = await this.userService.findOneByEmail(credential.email);

    if (!user) {
      throw new HttpException(
        'Invalid Email Or Password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      credential.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid Email Or Password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const secret = this.configService.getOrThrow<string>(
      'CLIENT_JWT_SCERET_KEY',
    );

    const expiresIn = this.configService.getOrThrow<string>(
      'CLIENT_JWT_EXPIRES_IN',
    ) as `${number}${'s' | 'm' | 'h' | 'd'}`;

    const expiresAt = new Date(
      Date.now() +
        Number(expiresIn.slice(0, -1)) *
          ({
            s: 1_000,
            m: 60_000,
            h: 3_600_000,
            d: 86_400_000,
          }[expiresIn.slice(-1)] ?? 0),
    );
    const tokenId = randomUUID();

    const payload: UserAuthPayload = {
      sub: user.id,
      tokenId,
      email: user.email,
      name: user.name,
    };

    const accessToken: string = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });

    const savedTokenId = await this.userTokenService.saveToken({
      id: tokenId,
      userId: user.id,
      token: accessToken,
      expiresAt,
    });

    if (!savedTokenId) {
      throw new HttpException(
        'Failed to persist the authentication token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      token: `Bearer ${accessToken}`,
    };
  }
}
