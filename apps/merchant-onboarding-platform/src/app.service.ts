import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping() {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'pong',
    };
  }
}
