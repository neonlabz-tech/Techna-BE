import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';

import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Role } from '../enums/role.enum';

// ─── Shared Fixtures ──────────────────────────────────────────────────────────
const VALID_MODULE_OID     = '64f1a2b3c4d5e6f7a8b9c0d1';
const VALID_ATTENDANCE_OID = '66643f2a1234567890abcdef';
const VALID_QR_TOKEN       = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const VALID_DATE           = '2024-06-08T09:00:00.000Z';
const VALID_STUDENT_ID     = 'STU-001';

const attendanceRecord: any = {
  _id:         VALID_ATTENDANCE_OID,
  studentId:   VALID_STUDENT_ID,
  moduleId:    VALID_MODULE_OID,
  moduleName:  'Mathematics',
  date:        VALID_DATE,
  sessionDate: '2024-06-08',
  status:      'present',
  markedAt:    VALID_DATE,
};

const scanResult = {
  success:    true,
  message:    'Attendance marked successfully',
  attendance: attendanceRecord,
};

// ─── Mock Service ─────────────────────────────────────────────────────────────
const mockAttendanceService = {
  scanQr:         jest.fn(),
  create:         jest.fn(),
  findAll:        jest.fn(),
  findOne:        jest.fn(),
  findByStudent:  jest.fn(),
  update:         jest.fn(),
  remove:         jest.fn(),
  getReport:      jest.fn(),
};

// ─────────────────────────────────────────────────────────────────────────────

describe('AttendanceController', () => {
  let controller: AttendanceController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        { provide: AttendanceService, useValue: mockAttendanceService },
      ],
    })
      .overrideGuard(require('../auth/jwt-auth.guard').JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(require('../auth/roles.guard').RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ===========================================================================
  // scanQr()
  // ===========================================================================

  describe('scanQr()', () => {
    const dto = {
      qrToken:    VALID_QR_TOKEN,
      moduleId:   VALID_MODULE_OID,
      moduleName: 'Mathematics',
      date:       VALID_DATE,
      status:     'present' as const,
    };

    it('delegates to AttendanceService.scanQr() and returns the result', async () => {
      mockAttendanceService.scanQr.mockResolvedValue(scanResult);

      const result = await controller.scanQr(dto as any);

      expect(mockAttendanceService.scanQr).toHaveBeenCalledTimes(1);
      expect(mockAttendanceService.scanQr).toHaveBeenCalledWith(dto);
      expect(result).toEqual(scanResult);
    });

    it('propagates exceptions from the service unchanged', async () => {
      const error = new Error('Service error');
      mockAttendanceService.scanQr.mockRejectedValue(error);

      await expect(controller.scanQr(dto as any)).rejects.toThrow('Service error');
    });
  });

  // ===========================================================================
  // create()
  // ===========================================================================

  describe('create()', () => {
    const dto = {
      studentId:  VALID_STUDENT_ID,
      moduleId:   VALID_MODULE_OID,
      moduleName: 'Mathematics',
      date:       VALID_DATE,
      status:     'present' as const,
      markedAt:   VALID_DATE,
    };

    it('delegates to AttendanceService.create() and returns the record', async () => {
      mockAttendanceService.create.mockResolvedValue(attendanceRecord);

      const result = await controller.create(dto as any);

      expect(mockAttendanceService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(attendanceRecord);
    });
  });

  // ===========================================================================
  // findAll()
  // ===========================================================================

  describe('findAll()', () => {
    it('delegates to AttendanceService.findAll() and returns the list', async () => {
      mockAttendanceService.findAll.mockResolvedValue([attendanceRecord]);

      const result = await controller.findAll();

      expect(mockAttendanceService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([attendanceRecord]);
    });
  });

  // ===========================================================================
  // findOne()
  // ===========================================================================

  describe('findOne()', () => {
    it('delegates to AttendanceService.findOne() with the correct id', async () => {
      mockAttendanceService.findOne.mockResolvedValue(attendanceRecord);

      const result = await controller.findOne(VALID_ATTENDANCE_OID);

      expect(mockAttendanceService.findOne).toHaveBeenCalledWith(VALID_ATTENDANCE_OID);
      expect(result).toEqual(attendanceRecord);
    });
  });

  // ===========================================================================
  // findByStudent() — inline access control
  // ===========================================================================

  describe('findByStudent()', () => {
    it('allows ADMIN to access any student records', async () => {
      mockAttendanceService.findByStudent.mockResolvedValue([attendanceRecord]);

      const req = { user: { role: Role.ADMIN, userId: 'ADMIN-001' } };
      const result = await controller.findByStudent(VALID_STUDENT_ID, req);

      expect(mockAttendanceService.findByStudent).toHaveBeenCalledWith(VALID_STUDENT_ID);
      expect(result).toEqual([attendanceRecord]);
    });

    it('allows TEACHER to access any student records', async () => {
      mockAttendanceService.findByStudent.mockResolvedValue([attendanceRecord]);

      const req = { user: { role: Role.TEACHER, userId: 'TEACHER-001' } };
      const result = await controller.findByStudent(VALID_STUDENT_ID, req);

      expect(mockAttendanceService.findByStudent).toHaveBeenCalledWith(VALID_STUDENT_ID);
      expect(result).toEqual([attendanceRecord]);
    });

    it('allows STUDENT to view their own attendance records', async () => {
      mockAttendanceService.findByStudent.mockResolvedValue([attendanceRecord]);

      const req = { user: { role: Role.STUDENT, userId: VALID_STUDENT_ID } };
      const result = await controller.findByStudent(VALID_STUDENT_ID, req);

      expect(mockAttendanceService.findByStudent).toHaveBeenCalledWith(VALID_STUDENT_ID);
      expect(result).toEqual([attendanceRecord]);
    });

    it('throws ForbiddenException when STUDENT accesses another student records', async () => {
      const req = { user: { role: Role.STUDENT, userId: 'STU-DIFFERENT' } };

      expect(() => controller.findByStudent(VALID_STUDENT_ID, req)).toThrow(ForbiddenException);

      // Service must NOT be called if access is denied
      expect(mockAttendanceService.findByStudent).not.toHaveBeenCalled();
    });

    it('ForbiddenException message is "You can only view your own attendance"', () => {
      const req = { user: { role: Role.STUDENT, userId: 'STU-OTHER' } };

      expect(() => controller.findByStudent(VALID_STUDENT_ID, req)).toThrow(
        'You can only view your own attendance',
      );
    });
  });

  // ===========================================================================
  // getReport()
  // ===========================================================================

  describe('getReport()', () => {
    it('delegates to AttendanceService.getReport() and returns the report', async () => {
      const report = { total: 1, present: 1, absent: 0, records: [attendanceRecord] };
      mockAttendanceService.getReport.mockResolvedValue(report);

      const query = { studentId: VALID_STUDENT_ID };
      const result = await controller.getReport(query as any);

      expect(mockAttendanceService.getReport).toHaveBeenCalledWith(query);
      expect(result).toEqual(report);
    });
  });

  // ===========================================================================
  // update()
  // ===========================================================================

  describe('update()', () => {
    it('delegates to AttendanceService.update() with id and dto', async () => {
      const updated = { ...attendanceRecord, status: 'absent' };
      mockAttendanceService.update.mockResolvedValue(updated);

      const result = await controller.update(VALID_ATTENDANCE_OID, { status: 'absent' } as any);

      expect(mockAttendanceService.update).toHaveBeenCalledWith(
        VALID_ATTENDANCE_OID,
        { status: 'absent' },
      );
      expect(result).toEqual(updated);
    });
  });

  // ===========================================================================
  // remove()
  // ===========================================================================

  describe('remove()', () => {
    it('delegates to AttendanceService.remove() and returns void', async () => {
      mockAttendanceService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(VALID_ATTENDANCE_OID)).resolves.toBeUndefined();

      expect(mockAttendanceService.remove).toHaveBeenCalledWith(VALID_ATTENDANCE_OID);
    });
  });
});
