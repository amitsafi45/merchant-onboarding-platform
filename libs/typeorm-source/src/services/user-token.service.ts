import { UserToken } from '@app/typeorm-source';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}
  /**
   * Saves a user token and returns its generated ID.
   */
  async saveToken(data: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<string> {
    const result = await this.userTokenRepository.insert(data);
    return result.identifiers[0].id;
  }
}
