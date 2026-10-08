import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskReviewWorkerService {
  getHello(): string {
    return 'Hello World!';
  }
}
