import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { RiskDecisionDto } from '../dto/reviewer.dto';

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

  @Patch('/reviewer/applications/risk-decision')
  @AdminRoles(AdminRole.REVIEWER)
  @UseGuards(AdminAuthentication, AdminAuthorization)
  @ApiOperation({
    summary: 'Perform a risk decision on an application',
    description:
      'Reviewers can perform risk decisions only on applications assigned to them. System admins can perform risk decisions on any application.',
  })
  @ApiResponse({
    status: 200,
    description: 'Risk decision submitted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async performRiskDecision(
    @Req() req: Request & { admin: AdminAuthPayload },
    @Body() body: RiskDecisionDto,
  ) {
    await this.reviewerService.performRiskDecision(req.admin, body);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Risk decision performed successfully.',
    };
  }
}
