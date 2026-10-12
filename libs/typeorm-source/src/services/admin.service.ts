import { AdminRole, PaginatedResponse } from '@app/common';
import { PaginationQueryDto } from '@app/common/pagination-query.dto';
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
  async getReviewersByAdmin(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Admin>> {
    const { page, limit } = paginationQueryDto;

    const [admin, total] = await this.adminRepository.findAndCount({
      where: { role: AdminRole.REVIEWER },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: admin,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
