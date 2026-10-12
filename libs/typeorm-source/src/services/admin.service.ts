import { AdminRole } from '@app/common';
import { Admin } from '@app/typeorm-source';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findOneByEmail(email: string) {
    return this.adminRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
  }
  async getReviewersByAdmin() {
    return this.adminRepository.find({ where: { role: AdminRole.REVIEWER } });
  }

  async getReviewerById(
    reviewerId: string,
    manager: EntityManager,
  ): Promise<Admin | null> {
    return manager.getRepository(Admin).findOne({
      where: {
        id: reviewerId,
        role: AdminRole.REVIEWER,
      },
    });
  }
}
