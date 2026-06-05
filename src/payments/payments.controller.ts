import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentTrackingQueryDto } from './dto/payment-tracking-query.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ─── GET /api/payments  (admin only) ────────────────────────────────────────
  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    const payments = await this.paymentsService.findAll();

    return { success: true, payments };
  }

  // ─── GET /api/payments/student/:studentId  (admin + own student) ─────────────
  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.STUDENT)
  async findByStudent(@Param('studentId') studentId: string, @Request() req: any) {
    if (req.user.role === Role.STUDENT && req.user.userId !== studentId) {
      throw new ForbiddenException('You can only view your own payments');
    }

    const payments = await this.paymentsService.findByStudent(studentId);

    return { success: true, payments };
  }

  // ─── GET /api/payments/student/:studentId/tracking ─────────────────────────
  @Get('student/:studentId/tracking')
  @Roles(Role.ADMIN, Role.STUDENT)
  async tracking(
    @Param('studentId') studentId: string,
    @Query() query: PaymentTrackingQueryDto,
    @Request() req: any,
  ) {
    if (req.user.role === Role.STUDENT && req.user.userId !== studentId) {
      throw new ForbiddenException('You can only view your own payments');
    }

    return this.paymentsService.getStudentTracking(studentId, query);
  }

  // ─── POST /api/payments  (admin only) ───────────────────────────────────────
  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() body: CreatePaymentDto) {
    const payment = await this.paymentsService.create(body);

    return { success: true, payment };
  }
}
