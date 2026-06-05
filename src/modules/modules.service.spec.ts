import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ModulesService } from './modules.service';
import { Module as SchoolModule } from './schemas/module.schema';

describe('ModulesService', () => {
  let service: ModulesService;
  const moduleModelMock = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        {
          provide: getModelToken(SchoolModule.name),
          useValue: moduleModelMock,
        },
      ],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
