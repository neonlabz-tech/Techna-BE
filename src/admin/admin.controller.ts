import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Public } from '../auth/public.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Register a new admin
   * This endpoint should be disabled after initial setup or protected
   */
  @Post('register')
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'admin@techna.com' },
        password: { type: 'string', example: 'Admin@1234' },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async registerAdmin(@Body() body: { email: string; password: string }) {
    return this.adminService.registerAdmin(body.email, body.password);
  }
}
