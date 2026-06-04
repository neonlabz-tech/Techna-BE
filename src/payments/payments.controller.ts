import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ─── GET /api/payments  (admin only) ────────────────────────────────────────
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.paymentsService.findAll();
  }

  // ─── GET /api/payments/student/:studentId  (admin + own student) ─────────────
  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.STUDENT)
  findByStudent(@Param('studentId') studentId: string, @Request() req: any) {
    if (req.user.role === Role.STUDENT && req.user.userId !== studentId) {
      throw new ForbiddenException('You can only view your own payments');
    }
    return this.paymentsService.findByStudent(studentId);
  }

  // ─── POST /api/payments  (admin only) ───────────────────────────────────────
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: any) {
    return this.paymentsService.create(body);
  }
}
