import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { Teacher } from './schemas/teacher.schema';

const PUBLIC_SELECT =
  'fullName firstName lastName email phone subject qualification experience ' +
  'specializations awards achievements biography photoUrl degree';

@ApiTags('public-teachers')
@Controller('public/teachers')
export class PublicTeachersController {
  constructor(
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
  ) {}

  // ── GET /api/public/teachers ───────────────────────────────────────────────
  // Returns all active teachers — used by the website modules page to build
  // a subject→teacher map without N+1 requests.
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active teachers (no auth required)' })
  async findAllPublic() {
    return this.teacherModel
      .find({ status: 'active' })
      .select(PUBLIC_SELECT)
      .lean();
  }

  // ── GET /api/public/teachers/by-subject/:subjectName ───────────────────────
  // IMPORTANT: must be declared BEFORE /:id so NestJS doesn't swallow it.
  @Public()
  @Get('by-subject/:subjectName')
  @ApiOperation({ summary: 'Find first teacher for a given subject name (no auth required)' })
  async findBySubject(@Param('subjectName') subjectName: string) {
    const teacher = await this.teacherModel
      .findOne({ subject: subjectName, status: 'active' })
      .select(PUBLIC_SELECT)
      .lean();

    if (!teacher) throw new NotFoundException('No teacher found for this subject');
    return teacher;
  }

  // ── GET /api/public/teachers/:id ──────────────────────────────────────────
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get public teacher profile by ID (no auth required)' })
  async findPublicById(@Param('id') id: string) {
    const teacher = await this.teacherModel
      .findById(id)
      .select(PUBLIC_SELECT)
      .lean();

    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }
}
