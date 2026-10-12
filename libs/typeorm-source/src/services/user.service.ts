import { User } from '@app/typeorm-source';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });
  }
}
