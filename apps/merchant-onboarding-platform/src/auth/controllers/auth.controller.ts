import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginCredentialsDto } from '../dto/auth.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    type: LoginCredentialsDto,
    description: 'Email and password credential',
  })
  @ApiResponse({ description: 'User logged in successfully.' })
  async login(@Body() credential: LoginCredentialsDto) {
    const response = await this.authService.userLogin(credential);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Logged in successfully.',
      data: response,
    };
  }

  @Post('/admin/login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    type: LoginCredentialsDto,
    description: 'Email and password credential',
  })
  @ApiResponse({ description: 'Admin logged in successfully.' })
  async adminLogin(@Body() credential: LoginCredentialsDto) {
    const response = await this.authService.adminLogin(credential);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Logged in successfully.',
      data: response,
    };
  }
}
