"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamNoticesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const exam_notices_controller_1 = require("./exam-notices.controller");
const exam_notices_service_1 = require("./exam-notices.service");
const exam_notice_schema_1 = require("./schemas/exam-notice.schema");
const student_schema_1 = require("../students/schemas/student.schema");
const result_schema_1 = require("../results/schemas/result.schema");
const notifications_module_1 = require("../notifications/notifications.module");
let ExamNoticesModule = class ExamNoticesModule {
};
exports.ExamNoticesModule = ExamNoticesModule;
exports.ExamNoticesModule = ExamNoticesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: exam_notice_schema_1.ExamNotice.name, schema: exam_notice_schema_1.ExamNoticeSchema },
                { name: student_schema_1.Student.name, schema: student_schema_1.StudentSchema },
                { name: result_schema_1.Result.name, schema: result_schema_1.ResultSchema },
            ]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [exam_notices_controller_1.ExamNoticesController],
        providers: [exam_notices_service_1.ExamNoticesService],
        exports: [exam_notices_service_1.ExamNoticesService],
    })
], ExamNoticesModule);
//# sourceMappingURL=exam-notices.module.js.map