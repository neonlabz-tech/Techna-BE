import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ResultsService } from './results.service';
import { Result } from './schemas/result.schema';
import { Student } from '../students/schemas/student.schema';

describe('ResultsService', () => {
  let service: ResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        {
          provide: getModelToken(Result.name),
          useValue: {},
        },
        {
          provide: getModelToken(Student.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
