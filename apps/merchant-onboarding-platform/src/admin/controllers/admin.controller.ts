import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminAuthentication,
  AdminAuthorization,
  AdminRoles,
} from '@app/guards';
import { AdminRole } from '@app/common';
import { AdminService } from '../services/admin.service';
import { AssignReviewerDto } from '../dto/admin.dto';
import { PaginationQueryDto } from '@app/common/pagination-query.dto';

@ApiTags('Admin API')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/applications')
  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AdminAuthentication, AdminAuthorization)
  @ApiOperation({ summary: 'Get all merchant applications' })
  @ApiResponse({
    status: 200,
    description: 'Merchant applications retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async getApplicationsByAdmin(
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    const { data, ...metadata } =
      await this.adminService.getApplicationsByAdmin(paginationQueryDto);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Merchant applications retrieved successfully.',
      data: data,
      metadata: metadata,
    };
  }
  @Get('/reviewers')
  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AdminAuthentication, AdminAuthorization)
  @ApiOperation({ summary: 'Get all reviewers' })
  @ApiResponse({
    status: 200,
    description: 'Reviewers retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async getReviewersByAdmin() {
    const data = await this.adminService.getReviewersByAdmin();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Reviewers retrieved successfully.',
      data,
    };
  }

  @Patch('/applications/assign-reviewer')
  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AdminAuthentication, AdminAuthorization)
  @ApiOperation({ summary: 'Assign a reviewer to a merchant application' })
  @ApiResponse({
    status: 200,
    description: 'Reviewer assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or UUID format',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 404,
    description: 'Application or reviewer ID does not match',
  })
  async assignReviewer(@Body() body: AssignReviewerDto) {
    const data = await this.adminService.assignReviewer(body);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Reviewer assigned successfully.',
      data,
    };
  }
}
