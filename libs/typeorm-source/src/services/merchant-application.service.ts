import { MerchantApplication } from '@app/typeorm-source';
import { ApplicationStatus, PaginatedResponse } from '@app/common';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PaginationQueryDto } from '@app/common/pagination-query.dto';

@Injectable()
export class MerchantApplicationService {
  constructor(
    @InjectRepository(MerchantApplication)
    private readonly merchantApplicationRepository: Repository<MerchantApplication>,
  ) {}

  async create({
    input,
    userId,
  }: {
    input: Partial<MerchantApplication>;
    userId: string;
  }): Promise<MerchantApplication> {
    const application = this.merchantApplicationRepository.create({
      ...input,
      submittedBy: userId,
    });

    return this.merchantApplicationRepository.save(application);
  }

  async update({
    applicationId,
    input,
    userId,
  }: {
    applicationId: string;
    input: Partial<MerchantApplication>;
    userId: string;
  }): Promise<MerchantApplication> {
    const application = await this.merchantApplicationRepository.findOne({
      where: {
        id: applicationId,
        submittedBy: userId,
      },
    });

    if (!application) {
      throw new NotFoundException('Merchant application not found');
    }

    if (application.status !== ApplicationStatus.DRAFT) {
      throw new ForbiddenException('Only draft applications can be updated');
    }

    Object.assign(application, input);

    return this.merchantApplicationRepository.save(application);
  }

  async getOwnApplications(
    userId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<MerchantApplication>> {
    const { page, limit } = paginationQueryDto;

    const [applications, total] =
      await this.merchantApplicationRepository.findAndCount({
        where: {
          submittedBy: userId,
        },
        relations: {
          riskReview: true,
        },
        select: {
          id: true,
          businessName: true,
          legalBusinessName: true,
          businessType: true,
          ownerName: true,
          ownerEmail: true,
          ownerPhone: true,
          requestedProcessingVolume: true,
          status: true,
          requestedTransactionType: true,
          businessRegistrationNumber: true,
          businessWebsite: true,
          businessAddress: true,
          taxIdentificationNumber: true,
          submittedBy: true,
          createdAt: true,
          updatedAt: true,
          riskReview: {
            id: true,
            status: true,
            score: true,
            reason: true,
            adminReason: true,
            providerReference: true,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });

    return {
      data: applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getApplicationsByAdmin(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<MerchantApplication>> {
    const { page, limit } = paginationQueryDto;

    const [applications, total] =
      await this.merchantApplicationRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      });
    return {
      data: applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOwnApplicationById(data: { applicationId: string; userId: string }) {
    return this.merchantApplicationRepository.findOneBy({
      id: data.applicationId,
      submittedBy: data.userId,
    });
  }

  async updateStatusById(
    status: ApplicationStatus,
    applicationId: string,
    manager: EntityManager,
  ): Promise<void> {
    await manager
      .getRepository(MerchantApplication)
      .update({ id: applicationId }, { status });
  }
}
