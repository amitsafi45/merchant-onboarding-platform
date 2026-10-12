import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRole } from '@app/common';
import {
  AdminAuthentication,
  AdminAuthorization,
  AdminRoles,
  AdminAuthPayload,
} from '@app/guards';
import { ReviewerService } from '../services/reviewer.service';

@ApiTags('Reviewer API')
@ApiBearerAuth()
@Controller()
export class ReviewerController {
  constructor(private readonly reviewerService: ReviewerService) {}

  @Get('/reviewer/applications')
  @AdminRoles(AdminRole.REVIEWER)
  @UseGuards(AdminAuthentication, AdminAuthorization)
  @ApiOperation({
    summary:
      'Get risk reviews assigned to the reviewer or all risk reviews for admin',
    description:
      'Reviewers can view only risk reviews assigned to them. Admins can view all risk reviews.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviewer applications retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async getApplicationsByReviewer(
    @Req() req: Request & { admin: AdminAuthPayload },
  ) {
    const data = await this.reviewerService.getApplicationsForReview(req.admin);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Reviewer applications retrieved successfully.',
      data: data,
    };
  }
}
