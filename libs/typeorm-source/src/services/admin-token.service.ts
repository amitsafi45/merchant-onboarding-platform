import { AdminToken } from '@app/typeorm-source';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminTokenService {
  constructor(
    @InjectRepository(AdminToken)
    private readonly adminTokenRepository: Repository<AdminToken>,
  ) {}
  /**
   * Saves a user token and returns its generated ID.
   */
  async saveToken(data: {
    id: string;
    adminId: string;
    token: string;
    expiresAt: Date;
  }): Promise<string> {
    const result = await this.adminTokenRepository.insert(data);
    return result.identifiers[0].id;
  }
}
