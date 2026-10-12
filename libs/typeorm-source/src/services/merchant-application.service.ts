import { MerchantApplication } from '@app/typeorm-source';
import { ApplicationStatus } from '@app/common';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

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

  async getOwnApplications(userId: string): Promise<MerchantApplication[]> {
    return this.merchantApplicationRepository.find({
      where: {
        submittedBy: userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getApplicationsByAdmin() {
    return this.merchantApplicationRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
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
