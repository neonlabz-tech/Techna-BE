import { PartialType } from '@nestjs/mapped-types';
import { CreateExamNoticeDto } from './create-exam-notice.dto';

export class UpdateExamNoticeDto extends PartialType(CreateExamNoticeDto) {}
 