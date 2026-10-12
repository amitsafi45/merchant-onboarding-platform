import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SellerService } from '../services/seller.service';
import {
  CreateMerchantApplicationDto,
  UpdateMerchantApplicationDto,
} from '../dto/seller.dto';
import { SellerAuthentication, UserAuthPayload } from '@app/guards';

@Controller()
@ApiTags('Seller(normal user) api')
@ApiBearerAuth()
@UseGuards(SellerAuthentication)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('/applications')
  @ApiOperation({ summary: 'Create a merchant application' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreateMerchantApplicationDto,
    @Req() req: Request & { user: UserAuthPayload },
  ) {
    await this.sellerService.createApplication({
      input: dto,
      userId: req.user.sub,
    });
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Application created successfully.',
    };
  }

  @Patch('/applications/:applicationId')
  @ApiOperation({ summary: 'Update a draft merchant application' })
  @ApiResponse({ status: 200, description: 'Application updated successfully' })
  @ApiResponse({ status: 403, description: 'Application is not editable' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async update(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() dto: UpdateMerchantApplicationDto,
    @Req() req: Request & { user: UserAuthPayload },
  ) {
    await this.sellerService.updateApplication({
      applicationId,
      input: dto,
      userId: req.user.sub,
    });
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Application updated successfully.',
    };
  }

  @Get('/applications')
  @ApiOperation({ summary: 'Get my merchant applications' })
  @ApiResponse({
    status: 200,
    description: 'Seller applications retrieved successfully',
  })
  async getOwnApplications(@Req() req: Request & { user: UserAuthPayload }) {
    const data = await this.sellerService.getOwnApplications(req.user.sub);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Application fetch successfully.',
      data: data,
    };
  }
}
