"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExamNoticeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_exam_notice_dto_1 = require("./create-exam-notice.dto");
class UpdateExamNoticeDto extends (0, swagger_1.PartialType)(create_exam_notice_dto_1.CreateExamNoticeDto) {
}
exports.UpdateExamNoticeDto = UpdateExamNoticeDto;
//# sourceMappingURL=update-exam-notice.dto.js.map