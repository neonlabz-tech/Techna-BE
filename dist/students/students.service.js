"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StudentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const mongoose_2 = require("mongoose");
const node_crypto_1 = require("node:crypto");
const QRCode = __importStar(require("qrcode"));
const email_service_1 = require("../email/email.service");
const storage_service_1 = require("../storage/storage.service");
const notifications_service_1 = require("../notifications/notifications.service");
const notifications_auto_service_1 = require("../notifications/notifications-auto.service");
const counter_schema_1 = require("./schemas/counter.schema");
const student_schema_1 = require("./schemas/student.schema");
let StudentsService = StudentsService_1 = class StudentsService {
    constructor(studentModel, counterModel, emailService, storageService, notificationsService, notificationsAutoService) {
        this.studentModel = studentModel;
        this.counterModel = counterModel;
        this.emailService = emailService;
        this.storageService = storageService;
        this.notificationsService = notificationsService;
        this.notificationsAutoService = notificationsAutoService;
        this.logger = new common_1.Logger(StudentsService_1.name);
    }
    async findAll(status) {
        const filter = status ? { status } : {};
        return this.studentModel.find(filter).select('-password').lean();
    }
    async getUniqueBatches() {
        const batches = await this.studentModel.distinct('batch', {
            batch: { $nin: [null, ''] },
        });
        return Array.from(new Set(batches
            .map((batch) => (typeof batch === 'string' ? batch.trim() : ''))
            .filter(Boolean))).sort((a, b) => a.localeCompare(b));
    }
    async findOne(id) {
        const student = await this.studentModel
            .findById(id)
            .select('-password')
            .lean();
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return student;
    }
    async registerStudent(dto, profilePhoto) {
        if (!dto.subjectSelection.agreed) {
            throw new common_1.BadRequestException('You must agree to the terms before submitting the registration');
        }
        const dateOfBirth = this.resolveDateOfBirth(dto.personal);
        const email = dto.account.email.trim().toLowerCase();
        const existingEmail = await this.studentModel.findOne({ email }).lean();
        if (existingEmail) {
            throw new common_1.ConflictException('An account with this email address already exists');
        }
        if (dto.personal.nicNo) {
            const existingNic = await this.studentModel
                .findOne({ nicNo: dto.personal.nicNo.trim() })
                .lean();
            if (existingNic) {
                throw new common_1.ConflictException('An application with this NIC number already exists');
            }
        }
        const year = new Date().getFullYear();
        const [studentId, admissionNumber, serialNumber, applicationReference,] = await Promise.all([
            this.generateStudentId(),
            this.generateReference('admissionNumber', 'ADM', year),
            this.generateReference('serialNumber', 'SN', year),
            this.generateReference('applicationReference', 'APP', year),
        ]);
        const selectedSubjects = dto.subjectSelection.subjects ?? [];
        const uploadedProfilePhoto = profilePhoto
            ? await this.storageService.uploadProfilePhoto({
                body: profilePhoto.buffer,
                originalName: profilePhoto.originalname,
                contentType: profilePhoto.mimetype,
                scope: studentId,
                metadata: {
                    studentId,
                    email,
                },
            })
            : null;
        const profilePhotoUrl = uploadedProfilePhoto?.publicUrl ?? undefined;
        const payload = {
            studentId,
            qrToken: (0, node_crypto_1.randomUUID)(),
            status: 'pending',
            enrolledAt: new Date().toISOString(),
            admissionNumber,
            serialNumber,
            applicationReference,
            email,
            password: await bcrypt.hash(dto.account.password, 10),
            name: dto.personal.fullNameEnglish?.trim().toUpperCase(),
            fullNameTamil: dto.personal.fullNameTamil?.trim(),
            fullNameEnglish: dto.personal.fullNameEnglish?.trim().toUpperCase(),
            dateOfBirth,
            dob: dateOfBirth.toISOString(),
            nicNo: dto.personal.nicNo?.trim(),
            school: dto.personal.school?.trim(),
            whatsappNo: dto.personal.whatsappNo?.trim(),
            phone: dto.personal.whatsappNo?.trim(),
            parentsNo: dto.personal.parentsNo?.trim(),
            permanentAddress: dto.personal.permanentAddress?.trim(),
            address: dto.personal.permanentAddress?.trim(),
            administrativeDistrict: dto.personal.administrativeDistrict,
            fixedTelephone: dto.personal.fixedTelephone?.trim(),
            residingSince: dto.personal.residingSince?.trim(),
            race: dto.personal.race,
            religion: dto.personal.religion,
            citizenByDescent: dto.personal.citizenByDescent ?? 'YES',
            contactAddress: dto.personal.contactAddress?.trim(),
            postalCode: dto.personal.postalCode?.trim(),
            fatherName: dto.parent?.fatherName?.trim().toUpperCase(),
            motherName: dto.parent?.motherName?.trim().toUpperCase(),
            guardianName: dto.parent?.guardianName?.trim().toUpperCase(),
            contactPerson: dto.parent?.contactPerson ?? 'Mother',
            guardianAddress: dto.parent?.guardianAddress?.trim(),
            guardianFixedTel: dto.parent?.guardianFixedTel?.trim(),
            guardianMobile: dto.parent?.guardianMobile?.trim(),
            parentName: dto.parent?.motherName?.trim().toUpperCase() ||
                dto.parent?.fatherName?.trim().toUpperCase() ||
                dto.parent?.guardianName?.trim().toUpperCase(),
            parentPhone: dto.personal.parentsNo?.trim() || dto.parent?.guardianMobile?.trim(),
            olCategory: dto.olRecords?.olCategory ?? 'Local O/L',
            olYear: dto.olRecords?.olYear?.trim(),
            olIndexNumber: dto.olRecords?.olIndexNumber?.trim(),
            olNameUsed: dto.olRecords?.olNameUsed?.trim().toUpperCase(),
            olAccept: dto.olRecords?.olAccept ?? 'Accept',
            olResults: dto.olRecords?.olResults ?? [],
            subjects: selectedSubjects,
            modules: selectedSubjects,
            agreed: dto.subjectSelection.agreed,
            batch: dto.batch?.trim() || '',
            ...(uploadedProfilePhoto
                ? {
                    profilePhoto: profilePhotoUrl,
                    avatar: profilePhotoUrl,
                    profilePhotoKey: uploadedProfilePhoto.key,
                }
                : {}),
        };
        try {
            const student = await this.studentModel.create(payload);
            void this.emailService.sendRegistrationEmail({
                email: student.email,
                name: student.fullNameEnglish ?? student.email,
                studentId: student.studentId,
            });
            const result = student.toObject();
            delete result.password;
            return {
                message: 'Registration submitted successfully. Awaiting admin approval.',
                data: result,
            };
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('A duplicate entry was detected — email or NIC already exists');
            }
            throw error;
        }
    }
    async create(data) {
        this.validateRegistration(data);
        const selectedSubjects = data.subjects?.length
            ? data.subjects
            : data.modules?.length
                ? data.modules
                : [];
        const payload = {
            ...data,
            email: data.email.trim().toLowerCase(),
            phone: data.whatsappNo?.trim() || data.phone?.trim() || '',
            whatsappNo: data.whatsappNo?.trim() || data.phone?.trim() || '',
            parentsNo: data.parentsNo?.trim() || data.parentPhone?.trim(),
            batch: data.batch.trim(),
            name: data.fullNameEnglish?.trim() || data.name?.trim() || data.email,
            fullNameEnglish: data.fullNameEnglish?.trim().toUpperCase() ||
                data.name?.trim().toUpperCase() ||
                data.email,
            address: data.permanentAddress?.trim() || data.address?.trim(),
            permanentAddress: data.permanentAddress?.trim() || data.address?.trim(),
            dateOfBirth: data.dateOfBirth,
            parentName: data.motherName?.trim() ||
                data.fatherName?.trim() ||
                data.guardianName?.trim() ||
                data.parentName?.trim(),
            parentPhone: data.parentsNo?.trim() ||
                data.guardianMobile?.trim() ||
                data.parentPhone?.trim(),
            modules: selectedSubjects,
            subjects: selectedSubjects,
            studentId: data.studentId?.trim() || (await this.generateStudentId()),
            qrToken: data.qrToken?.trim() || (0, node_crypto_1.randomUUID)(),
            status: data.status ?? 'pending',
            enrolledAt: data.enrolledAt ?? new Date().toISOString(),
        };
        payload.password = await bcrypt.hash(payload.password || 'Student@123', 10);
        try {
            const student = await this.studentModel.create(payload);
            void this.emailService.sendRegistrationEmail({
                email: student.email,
                name: student.fullNameEnglish ?? student.email,
                studentId: student.studentId,
            });
            const result = student.toObject();
            delete result.password;
            return result;
        }
        catch (error) {
            if (this.isDuplicateKeyError(error)) {
                throw new common_1.ConflictException('Student email or ID already exists');
            }
            throw error;
        }
    }
    async update(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const selectedSubjects = data.subjects?.length
            ? data.subjects
            : data.modules?.length
                ? data.modules
                : undefined;
        const payloadBase = { ...data };
        delete payloadBase.modules;
        delete payloadBase.subjects;
        const payload = {
            ...payloadBase,
            ...(selectedSubjects
                ? {
                    subjects: selectedSubjects,
                    modules: selectedSubjects,
                }
                : {}),
        };
        const student = await this.studentModel
            .findByIdAndUpdate(id, payload, {
            returnDocument: 'after',
            runValidators: true,
        })
            .select('-password')
            .lean();
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return student;
    }
    async remove(id) {
        const student = await this.studentModel.findById(id).lean();
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        if (student.qrImageKey) {
            try {
                await this.storageService.deleteObject(student.qrImageKey);
            }
            catch (error) {
                this.logger.error('Failed to delete QR image from R2', error instanceof Error ? error.message : String(error));
            }
        }
        await this.studentModel.findByIdAndDelete(id);
        return {
            message: 'Student and QR deleted successfully',
        };
    }
    async approveStudent(id) {
        const student = await this.findStudentByIdOrStudentId(id);
        const shouldSendEmail = student.status !== 'approved';
        student.status = 'approved';
        student.approvedAt = new Date().toISOString();
        student.rejectionReason = undefined;
        await student.save();
        if (shouldSendEmail) {
            void this.emailService.sendApprovalEmail({
                email: student.email,
                name: student.fullNameEnglish ?? student.email,
                studentId: student.studentId,
            });
            void this.notificationsService.notifyRegistrationApproved({
                _id: student._id.toString(),
                studentId: student.studentId,
                fullNameEnglish: student.fullNameEnglish,
                email: student.email,
            });
            void this.notificationsAutoService.onStudentApproved({
                _id: student._id.toString(),
                studentId: student.studentId,
                fullNameEnglish: student.fullNameEnglish,
                batch: student.batch,
            });
        }
        try {
            return await this.generateStudentQrCode(student.studentId);
        }
        catch (error) {
            this.logger.error('QR generation/upload failed', error instanceof Error ? error.message : String(error));
            const approvedStudent = await this.studentModel
                .findById(student._id)
                .select('-password')
                .exec();
            return approvedStudent ?? student;
        }
    }
    async rejectStudent(id, dto) {
        const student = await this.findStudentByIdOrStudentId(id);
        const shouldSendEmail = student.status !== 'rejected';
        student.status = 'rejected';
        student.rejectionReason = dto.reason.trim();
        await student.save();
        if (shouldSendEmail) {
            void this.emailService.sendRejectionEmail({
                email: student.email,
                name: student.fullNameEnglish ?? student.email,
                studentId: student.studentId,
                reason: dto.reason.trim(),
            });
        }
        return {
            message: 'Student registration rejected.',
            data: {
                _id: student._id,
                studentId: student.studentId,
                status: student.status,
                rejectionReason: student.rejectionReason,
            },
        };
    }
    async getEnrolmentHistory(targetId, requesterId, requesterRole) {
        if (requesterRole === 'student' && requesterId !== targetId) {
            throw new common_1.ForbiddenException('You can only view your own enrolment history');
        }
        const student = await this.studentModel
            .findById(targetId)
            .select('-password -qrCode -qrToken')
            .lean();
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return {
            studentId: student._id.toString(),
            studentCode: student.studentId,
            name: student.fullNameEnglish ?? '',
            email: student.email,
            phone: student.phone ?? student.whatsappNo ?? '',
            modules: student.subjects?.length
                ? student.subjects
                : student.modules ?? [],
            batch: student.batch ?? '',
            status: student.status,
            enrolledAt: student.enrolledAt,
            approvedAt: student.approvedAt ?? null,
            rejectionReason: student.rejectionReason,
        };
    }
    async generateStudentQrCode(studentId) {
        if (!studentId?.trim()) {
            throw new common_1.BadRequestException('studentId is required');
        }
        const student = await this.studentModel.findOne({ studentId }).exec();
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        if (student.status !== 'approved') {
            throw new common_1.BadRequestException('QR code can only be generated for approved students');
        }
        const qrPayload = {
            studentId: student.studentId,
            fullName: student.fullNameEnglish ?? '',
            email: student.email,
            admissionNo: student.admissionNumber,
        };
        try {
            const qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload), {
                errorCorrectionLevel: 'M',
                margin: 1,
                width: 300,
            });
            const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrPayload), {
                errorCorrectionLevel: 'M',
                margin: 1,
                type: 'png',
                width: 300,
            });
            const uploadedQr = await this.storageService.uploadQrImage({
                body: qrBuffer,
                originalName: `${student.studentId}.png`,
                contentType: 'image/png',
                scope: student.studentId,
                metadata: {
                    studentId: student.studentId,
                },
            });
            const updated = await this.studentModel
                .findByIdAndUpdate(student._id, {
                $set: {
                    qrCode,
                    qrCodeUrl: uploadedQr.publicUrl,
                    qrImageKey: uploadedQr.key,
                },
            }, { returnDocument: 'after' })
                .select('-password');
            return updated ?? student;
        }
        catch (error) {
            this.logger.error(`QR generation/upload failed for student ${studentId}`, error instanceof Error ? error.message : String(error));
            const fallback = await this.studentModel
                .findOne({ studentId })
                .select('-password')
                .lean();
            return (fallback ?? student);
        }
    }
    resolveDateOfBirth(personal) {
        if (personal.dateOfBirth) {
            const d = new Date(personal.dateOfBirth);
            if (isNaN(d.getTime())) {
                throw new common_1.BadRequestException('Invalid dateOfBirth value');
            }
            return d;
        }
        if (personal.dobDay && personal.dobMonth && personal.dobYear) {
            const { dobDay, dobMonth, dobYear } = personal;
            const d = new Date(dobYear, dobMonth - 1, dobDay);
            if (isNaN(d.getTime())) {
                throw new common_1.BadRequestException('Invalid date of birth — check dobDay, dobMonth, dobYear values');
            }
            return d;
        }
        throw new common_1.BadRequestException('Date of birth is required — provide dateOfBirth or dobDay + dobMonth + dobYear');
    }
    async generateStudentId() {
        const counter = await this.counterModel.findOneAndUpdate({ name: 'studentId' }, { $inc: { seq: 1 } }, {
            returnDocument: 'after',
            upsert: true,
        });
        const padded = String(counter.seq).padStart(3, '0');
        return `STU${padded}`;
    }
    async generateReference(name, prefix, year) {
        const counter = await this.counterModel.findOneAndUpdate({ name: `${name}_${year}` }, { $inc: { seq: 1 } }, {
            returnDocument: 'after',
            upsert: true,
        });
        if (!counter) {
            throw new common_1.InternalServerErrorException(`Failed to generate ${prefix} reference`);
        }
        const padded = String(counter.seq).padStart(4, '0');
        return `${prefix}-${year}-${padded}`;
    }
    async findStudentByIdOrStudentId(id) {
        if (!id?.trim()) {
            throw new common_1.BadRequestException('Student identifier is required');
        }
        const query = mongoose_2.Types.ObjectId.isValid(id)
            ? { $or: [{ _id: id }, { studentId: id }] }
            : { studentId: id };
        const student = await this.studentModel.findOne(query).exec();
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return student;
    }
    validateRegistration(dto) {
        this.validateRequiredString(dto.email, 'email');
        this.validateRequiredString(dto.phone ?? dto.whatsappNo, 'phone');
        this.validateRequiredString(dto.batch, 'batch');
        const rawDob = dto.dateOfBirth ?? dto.dob;
        if (rawDob) {
            const dob = new Date(rawDob);
            if (isNaN(dob.getTime())) {
                throw new common_1.BadRequestException('Invalid date of birth');
            }
            if (dob >= new Date()) {
                throw new common_1.BadRequestException('Date of birth cannot be today or a future date');
            }
        }
    }
    validateRequiredString(value, field) {
        if (!value?.trim()) {
            throw new common_1.BadRequestException(`${field} is required`);
        }
    }
    isDuplicateKeyError(error) {
        return (typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 11000);
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = StudentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(student_schema_1.Student.name)),
    __param(1, (0, mongoose_1.InjectModel)(counter_schema_1.Counter.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        email_service_1.EmailService,
        storage_service_1.StorageService,
        notifications_service_1.NotificationsService,
        notifications_auto_service_1.NotificationsAutoService])
], StudentsService);
//# sourceMappingURL=students.service.js.map