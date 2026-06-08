import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { AttendanceService } from './attendance.service';
import { Attendance } from './schemas/attendance.schema';
import { Student } from '../students/schemas/student.schema';
import { Module as SchoolModule } from '../modules/schemas/module.schema';

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '../common/exceptions';

// ─────────────────────────────────────────────────────────────────────────────
// makeQuery
// Returns a Mongoose-style thenable that works for ALL three call patterns:
//   await model.findOne()                        (direct await — used in create())
//   await model.findOne().exec()                 (with exec — used in scanQr())
//   await model.find().populate().sort().exec()  (chained — used in findAll())
// ─────────────────────────────────────────────────────────────────────────────
function makeQuery<T>(value: T): any {
  const p: any = Promise.resolve(value);
  p.exec     = jest.fn().mockResolvedValue(value);
  p.populate = jest.fn().mockReturnValue(p);
  p.sort     = jest.fn().mockReturnValue(p);
  return p;
}

// ─── Shared Fixtures ──────────────────────────────────────────────────────────
const VALID_MODULE_OID     = '64f1a2b3c4d5e6f7a8b9c0d1';
const ALT_MODULE_OID       = '64f1a2b3c4d5e6f7a8b9c0d2';
const VALID_ATTENDANCE_OID = '66643f2a1234567890abcdef';
const VALID_QR_TOKEN       = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const VALID_DATE           = '2024-06-08T09:00:00.000Z';
const VALID_STUDENT_ID     = 'STU-001';

const approvedStudent = {
  studentId: VALID_STUDENT_ID,
  qrToken:   VALID_QR_TOKEN,
  status:    'approved',
};

const moduleRecord = {
  _id:  VALID_MODULE_OID,
  name: 'Mathematics',
};

const attendanceRecord = {
  _id:         VALID_ATTENDANCE_OID,
  studentId:   VALID_STUDENT_ID,
  moduleId:    VALID_MODULE_OID,
  moduleName:  'Mathematics',
  date:        VALID_DATE,
  sessionDate: '2024-06-08',
  status:      'present',
  markedAt:    VALID_DATE,
};

// ─────────────────────────────────────────────────────────────────────────────

describe('AttendanceService', () => {
  let service: AttendanceService;
  let attendanceModel: Record<string, jest.Mock>;
  let studentModel:    Record<string, jest.Mock>;
  let moduleModel:     Record<string, jest.Mock>;

  beforeEach(async () => {
    // Default: every query returns null / empty so each test opts in explicitly.
    attendanceModel = {
      findOne:           jest.fn().mockReturnValue(makeQuery(null)),
      find:              jest.fn().mockReturnValue(makeQuery([])),
      findById:          jest.fn().mockReturnValue(makeQuery(null)),
      findByIdAndUpdate: jest.fn().mockReturnValue(makeQuery(null)),
      findByIdAndDelete: jest.fn().mockResolvedValue(null),
      create:            jest.fn().mockResolvedValue(attendanceRecord),
    };

    studentModel = {
      findOne:  jest.fn().mockReturnValue(makeQuery(null)),
      findById: jest.fn().mockReturnValue(makeQuery(null)),
    };

    moduleModel = {
      findById: jest.fn().mockReturnValue(makeQuery(null)),
    };

    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: getModelToken(Attendance.name),    useValue: attendanceModel },
        { provide: getModelToken(Student.name),       useValue: studentModel    },
        { provide: getModelToken(SchoolModule.name),  useValue: moduleModel     },
      ],
    }).compile();

    service = testModule.get<AttendanceService>(AttendanceService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ===========================================================================
  // scanQr()
  // ===========================================================================

  describe('scanQr()', () => {

    // ── Helper: sets up the full happy-path mock chain for scanQr ─────────────
    // scanQr calls studentModel.findOne TWICE:
    //   call 1 — qrToken lookup in scanQr()     (uses .exec())
    //   call 2 — studentId lookup in create()   (direct await)
    const setupHappyPath = (opts: {
      student?:           any;
      mod?:               any;
      existingRecord?:    any;
      createdRecord?:     any;
    } = {}) => {
      const student        = opts.student        ?? approvedStudent;
      const mod            = opts.mod            ?? moduleRecord;
      const existingRecord = opts.existingRecord ?? null;
      const createdRecord  = opts.createdRecord  ?? attendanceRecord;

      studentModel.findOne
        .mockReturnValueOnce(makeQuery(student))   // scanQr: qrToken lookup
        .mockReturnValueOnce(makeQuery(student));  // create: studentId lookup

      moduleModel.findById.mockReturnValue(makeQuery(mod));
      attendanceModel.findOne.mockReturnValue(makeQuery(existingRecord));
      attendanceModel.create.mockResolvedValue(createdRecord);
    };

    // ── QR Token Validation ───────────────────────────────────────────────────

    describe('QR Token Validation', () => {
      it('throws BadRequestException when qrToken is an empty string', async () => {
        await expect(
          service.scanQr({ qrToken: '', moduleId: VALID_MODULE_OID, moduleName: 'Math' }),
        ).rejects.toThrow(BadRequestException);

        expect(studentModel.findOne).not.toHaveBeenCalled();
      });

      it('throws BadRequestException when qrToken is only whitespace', async () => {
        await expect(
          service.scanQr({ qrToken: '   ', moduleId: VALID_MODULE_OID, moduleName: 'Math' }),
        ).rejects.toThrow(BadRequestException);

        expect(studentModel.findOne).not.toHaveBeenCalled();
      });
    });

    // ── Student Validation ────────────────────────────────────────────────────

    describe('Student Validation', () => {
      it('throws NotFoundException when qrToken does not match any student', async () => {
        studentModel.findOne.mockReturnValue(makeQuery(null));

        await expect(
          service.scanQr({ qrToken: 'unknown-token', moduleId: VALID_MODULE_OID, moduleName: 'Math' }),
        ).rejects.toThrow(NotFoundException);

        expect(moduleModel.findById).not.toHaveBeenCalled();
      });

      it('throws BadRequestException when student status is pending', async () => {
        studentModel.findOne.mockReturnValue(
          makeQuery({ ...approvedStudent, status: 'pending' }),
        );

        await expect(
          service.scanQr({ qrToken: VALID_QR_TOKEN, moduleId: VALID_MODULE_OID, moduleName: 'Math' }),
        ).rejects.toThrow(BadRequestException);
      });

      it('throws BadRequestException when student status is rejected', async () => {
        studentModel.findOne.mockReturnValue(
          makeQuery({ ...approvedStudent, status: 'rejected' }),
        );

        await expect(
          service.scanQr({ qrToken: VALID_QR_TOKEN, moduleId: VALID_MODULE_OID, moduleName: 'Math' }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    // ── Module Validation ─────────────────────────────────────────────────────

    describe('Module Validation', () => {
      beforeEach(() => {
        studentModel.findOne.mockReturnValue(makeQuery(approvedStudent));
      });

      it('throws NotFoundException when moduleId is not a valid ObjectId format', async () => {
        await expect(
          service.scanQr({ qrToken: VALID_QR_TOKEN, moduleId: 'not-an-objectid', moduleName: 'Math' }),
        ).rejects.toThrow(NotFoundException);

        // isValidObjectId returns false → findById must NOT be called
        expect(moduleModel.findById).not.toHaveBeenCalled();
      });

      it('throws NotFoundException when module does not exist in the database', async () => {
        moduleModel.findById.mockReturnValue(makeQuery(null));

        await expect(
          service.scanQr({ qrToken: VALID_QR_TOKEN, moduleId: VALID_MODULE_OID, moduleName: 'Math' }),
        ).rejects.toThrow(NotFoundException);

        // Duplicate check must NOT run if module is invalid
        expect(attendanceModel.findOne).not.toHaveBeenCalled();
      });
    });

    // ── Duplicate Prevention — Core Cases ─────────────────────────────────────

    describe('Duplicate Prevention', () => {
      it('CASE 1 — first scan succeeds: returns success:true and the attendance record', async () => {
        setupHappyPath();

        const result = await service.scanQr({
          qrToken:    VALID_QR_TOKEN,
          moduleId:   VALID_MODULE_OID,
          moduleName: 'Mathematics',
          date:       VALID_DATE,
          status:     'present',
        });

        expect(result.success).toBe(true);
        expect(result.message).toBe('Attendance marked successfully');
        expect(result.attendance).toEqual(attendanceRecord);
        expect(attendanceModel.create).toHaveBeenCalledTimes(1);
      });

      it('CASE 2 — duplicate scan (same student + module + date) throws ConflictException and does NOT insert', async () => {
        setupHappyPath({ existingRecord: attendanceRecord }); // record already exists

        await expect(
          service.scanQr({
            qrToken:    VALID_QR_TOKEN,
            moduleId:   VALID_MODULE_OID,
            moduleName: 'Mathematics',
            date:       VALID_DATE,
          }),
        ).rejects.toThrow(ConflictException);

        // The insert must never be reached
        expect(attendanceModel.create).not.toHaveBeenCalled();
      });

      it('CASE G — MongoDB error 11000 (concurrent race condition) throws ConflictException', async () => {
        // App-level check passes (both concurrent threads see no existing record)
        // but the DB unique index blocks the second insert
        studentModel.findOne
          .mockReturnValueOnce(makeQuery(approvedStudent))
          .mockReturnValueOnce(makeQuery(approvedStudent));

        moduleModel.findById.mockReturnValue(makeQuery(moduleRecord));
        attendanceModel.findOne.mockReturnValue(makeQuery(null)); // passes app check
        attendanceModel.create.mockRejectedValue({ code: 11000 }); // DB rejects

        await expect(
          service.scanQr({
            qrToken:    VALID_QR_TOKEN,
            moduleId:   VALID_MODULE_OID,
            moduleName: 'Mathematics',
          }),
        ).rejects.toThrow(ConflictException);
      });

      it('CASE 3 — different student, same module and date succeeds', async () => {
        const otherStudent = { studentId: 'STU-002', qrToken: 'qr-002', status: 'approved' };

        setupHappyPath({
          student:        otherStudent,
          existingRecord: null,
          createdRecord:  { ...attendanceRecord, studentId: 'STU-002' },
        });

        const result = await service.scanQr({
          qrToken:    'qr-002',
          moduleId:   VALID_MODULE_OID,
          moduleName: 'Mathematics',
        });

        expect(result.success).toBe(true);
        expect(attendanceModel.create).toHaveBeenCalledTimes(1);
      });

      it('CASE 4 — same student, different module, same date succeeds', async () => {
        setupHappyPath({
          mod:            { _id: ALT_MODULE_OID, name: 'Physics' },
          existingRecord: null,
          createdRecord:  { ...attendanceRecord, moduleId: ALT_MODULE_OID, moduleName: 'Physics' },
        });

        const result = await service.scanQr({
          qrToken:    VALID_QR_TOKEN,
          moduleId:   ALT_MODULE_OID,
          moduleName: 'Physics',
        });

        expect(result.success).toBe(true);
        expect(attendanceModel.create).toHaveBeenCalledTimes(1);
      });

      it('CASE 5 — same student and module, different date succeeds', async () => {
        setupHappyPath({ existingRecord: null });

        const result = await service.scanQr({
          qrToken:    VALID_QR_TOKEN,
          moduleId:   VALID_MODULE_OID,
          moduleName: 'Mathematics',
          date:       '2024-06-09T09:00:00.000Z', // next day
        });

        expect(result.success).toBe(true);
        expect(attendanceModel.create).toHaveBeenCalledTimes(1);
      });
    });

    // ── Data Integrity ────────────────────────────────────────────────────────

    describe('Data Integrity', () => {
      it('uses moduleName from the database — ignores the client-supplied moduleName', async () => {
        studentModel.findOne
          .mockReturnValueOnce(makeQuery(approvedStudent))
          .mockReturnValueOnce(makeQuery(approvedStudent));

        moduleModel.findById.mockReturnValue(
          makeQuery({ ...moduleRecord, name: 'Physics' }),
        );
        attendanceModel.findOne.mockReturnValue(makeQuery(null));
        attendanceModel.create.mockResolvedValue(attendanceRecord);

        await service.scanQr({
          qrToken:    VALID_QR_TOKEN,
          moduleId:   VALID_MODULE_OID,
          moduleName: 'Wrong Name From Client',
        });

        const createArg = attendanceModel.create.mock.calls[0][0];
        expect(createArg.moduleName).toBe('Physics');
        expect(createArg.moduleName).not.toBe('Wrong Name From Client');
      });

      it('stores sessionDate as YYYY-MM-DD derived from the date field', async () => {
        setupHappyPath();

        await service.scanQr({
          qrToken:    VALID_QR_TOKEN,
          moduleId:   VALID_MODULE_OID,
          moduleName: 'Mathematics',
          date:       '2024-06-08T22:59:00.000Z',
        });

        const createArg = attendanceModel.create.mock.calls[0][0];
        expect(createArg.sessionDate).toBe('2024-06-08');
      });

      it('defaults status to present when not provided', async () => {
        setupHappyPath();

        await service.scanQr({
          qrToken:    VALID_QR_TOKEN,
          moduleId:   VALID_MODULE_OID,
          moduleName: 'Mathematics',
          // status not provided
        });

        const createArg = attendanceModel.create.mock.calls[0][0];
        expect(createArg.status).toBe('present');
      });
    });
  });

  // ===========================================================================
  // create()
  // ===========================================================================

  describe('create()', () => {
    const validDto = {
      studentId:  VALID_STUDENT_ID,
      moduleId:   VALID_MODULE_OID,
      moduleName: 'Mathematics',
      date:       VALID_DATE,
      status:     'present' as const,
      markedAt:   VALID_DATE,
    };

    it('throws NotFoundException when student does not exist', async () => {
      studentModel.findOne.mockReturnValue(makeQuery(null));

      await expect(service.create(validDto)).rejects.toThrow(NotFoundException);
      expect(attendanceModel.create).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when status is invalid', async () => {
      studentModel.findOne.mockReturnValue(makeQuery(approvedStudent));

      await expect(
        service.create({ ...validDto, status: 'late' as any }),
      ).rejects.toThrow(BadRequestException);

      expect(attendanceModel.create).not.toHaveBeenCalled();
    });

    it('throws ConflictException when attendance already exists for the same session', async () => {
      studentModel.findOne.mockReturnValue(makeQuery(approvedStudent));
      attendanceModel.findOne.mockReturnValue(makeQuery(attendanceRecord));

      await expect(service.create(validDto)).rejects.toThrow(ConflictException);
      expect(attendanceModel.create).not.toHaveBeenCalled();
    });

    it('throws ConflictException on MongoDB error 11000 — race condition safety net', async () => {
      studentModel.findOne.mockReturnValue(makeQuery(approvedStudent));
      attendanceModel.findOne.mockReturnValue(makeQuery(null));
      attendanceModel.create.mockRejectedValue({ code: 11000 });

      await expect(service.create(validDto)).rejects.toThrow(ConflictException);
    });

    it('stores sessionDate as YYYY-MM-DD in the document sent to MongoDB', async () => {
      studentModel.findOne.mockReturnValue(makeQuery(approvedStudent));
      attendanceModel.findOne.mockReturnValue(makeQuery(null));
      attendanceModel.create.mockResolvedValue(attendanceRecord);

      await service.create({ ...validDto, date: '2024-06-08T23:45:00.000Z' });

      const createArg = attendanceModel.create.mock.calls[0][0];
      expect(createArg.sessionDate).toBe('2024-06-08');
    });

    it('returns the created attendance document on success', async () => {
      studentModel.findOne.mockReturnValue(makeQuery(approvedStudent));
      attendanceModel.findOne.mockReturnValue(makeQuery(null));
      attendanceModel.create.mockResolvedValue(attendanceRecord);

      const result = await service.create(validDto);
      expect(result).toEqual(attendanceRecord);
    });
  });

  // ===========================================================================
  // findAll()
  // ===========================================================================

  describe('findAll()', () => {
    it('returns all attendance records', async () => {
      attendanceModel.find.mockReturnValue(makeQuery([attendanceRecord]));

      const result = await service.findAll();

      expect(result).toEqual([attendanceRecord]);
      expect(attendanceModel.find).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================================================
  // findOne()
  // ===========================================================================

  describe('findOne()', () => {
    it('throws BadRequestException for a non-ObjectId id string', async () => {
      await expect(service.findOne('not-a-valid-id')).rejects.toThrow(BadRequestException);
      expect(attendanceModel.findById).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the record does not exist', async () => {
      attendanceModel.findById.mockReturnValue(makeQuery(null));

      await expect(service.findOne(VALID_MODULE_OID)).rejects.toThrow(NotFoundException);
    });

    it('returns the attendance document when found', async () => {
      attendanceModel.findById.mockReturnValue(makeQuery(attendanceRecord));

      const result = await service.findOne(VALID_MODULE_OID);
      expect(result).toEqual(attendanceRecord);
    });
  });

  // ===========================================================================
  // findByStudent()
  // ===========================================================================

  describe('findByStudent()', () => {
    it('throws NotFoundException when student does not exist', async () => {
      studentModel.findOne.mockReturnValue(makeQuery(null));

      await expect(service.findByStudent('UNKNOWN')).rejects.toThrow(NotFoundException);
    });

    it('returns attendance records for a valid student', async () => {
      studentModel.findOne.mockReturnValue(makeQuery(approvedStudent));
      attendanceModel.find.mockReturnValue(makeQuery([attendanceRecord]));

      const result = await service.findByStudent(VALID_STUDENT_ID);

      expect(result).toEqual([attendanceRecord]);
    });
  });

  // ===========================================================================
  // update()
  // ===========================================================================

  describe('update()', () => {
    it('throws BadRequestException for a non-ObjectId id', async () => {
      await expect(service.update('bad-id', {})).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when the record does not exist', async () => {
      attendanceModel.findByIdAndUpdate.mockReturnValue(makeQuery(null));

      await expect(
        service.update(VALID_ATTENDANCE_OID, { status: 'absent' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns the updated attendance document', async () => {
      const updated = { ...attendanceRecord, status: 'absent' };
      attendanceModel.findByIdAndUpdate.mockReturnValue(makeQuery(updated));

      const result = await service.update(VALID_ATTENDANCE_OID, { status: 'absent' });
      expect(result).toEqual(updated);
    });
  });

  // ===========================================================================
  // remove()
  // ===========================================================================

  describe('remove()', () => {
    it('throws BadRequestException for a non-ObjectId id', async () => {
      await expect(service.remove('bad-id')).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when the record does not exist', async () => {
      attendanceModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove(VALID_ATTENDANCE_OID)).rejects.toThrow(NotFoundException);
    });

    it('resolves void when deletion succeeds', async () => {
      attendanceModel.findByIdAndDelete.mockResolvedValue(attendanceRecord);

      await expect(service.remove(VALID_ATTENDANCE_OID)).resolves.toBeUndefined();
    });
  });
});
