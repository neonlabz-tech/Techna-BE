import { PartialType } from '@nestjs/swagger';
import { CreateExamNoticeDto } from './create-exam-notice.dto';

export class UpdateExamNoticeDto extends PartialType(CreateExamNoticeDto) {}
 
