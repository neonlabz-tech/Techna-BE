"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const email_module_1 = require("../email/email.module");
const counter_schema_1 = require("./schemas/counter.schema");
const student_schema_1 = require("./schemas/student.schema");
const students_controller_1 = require("./students.controller");
const students_service_1 = require("./students.service");
const storage_module_1 = require("../storage/storage.module");
const notifications_module_1 = require("../notifications/notifications.module");
let StudentsModule = class StudentsModule {
};
exports.StudentsModule = StudentsModule;
exports.StudentsModule = StudentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            email_module_1.EmailModule,
            mongoose_1.MongooseModule.forFeature([
                { name: student_schema_1.Student.name, schema: student_schema_1.StudentSchema },
                { name: counter_schema_1.Counter.name, schema: counter_schema_1.CounterSchema },
            ]),
            storage_module_1.StorageModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [students_controller_1.StudentsController],
        providers: [students_service_1.StudentsService],
        exports: [students_service_1.StudentsService],
    })
], StudentsModule);
//# sourceMappingURL=students.module.js.map