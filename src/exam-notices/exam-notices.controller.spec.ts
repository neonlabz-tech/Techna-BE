import { Test } from '@nestjs/testing';

import { ExamNoticesController } from './exam-notices.controller';
import { ExamNoticesService } from './exam-notices.service';

describe('ExamNoticesController', () => {
  let controller: ExamNoticesController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findPublished: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    publish: jest.fn(),
    unpublish: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ExamNoticesController],
      providers: [
        {
          provide: ExamNoticesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = moduleRef.get(ExamNoticesController);
    jest.clearAllMocks();
  });

  it('delegates create and CRUD actions to the service', async () => {
    service.create.mockResolvedValue({ id: '1' });
    service.findAll.mockResolvedValue([{ id: '1' }]);
    service.findPublished.mockResolvedValue([{ id: 'pub' }]);
    service.findOne.mockResolvedValue({ id: '1' });
    service.update.mockResolvedValue({ id: '1', title: 'Updated' });
    service.publish.mockResolvedValue({ id: '1', isPublished: true });
    service.unpublish.mockResolvedValue({ id: '1', isPublished: false });
    service.remove.mockResolvedValue({ message: 'Exam notice deleted successfully' });

    await expect(
      controller.create({
        title: 'Mid Term',
        moduleId: 'm1',
        moduleName: 'English',
        batch: 'May 2024 Batch',
        date: '2026-06-10',
        startTime: '09:00',
        endTime: '11:00',
        venue: 'Hall A',
        totalMarks: 100,
        status: 'upcoming',
      }),
    ).resolves.toEqual({ id: '1' });

    await expect(controller.findAll()).resolves.toEqual([{ id: '1' }]);
    await expect(controller.findPublished()).resolves.toEqual([{ id: 'pub' }]);
    await expect(controller.findOne('1')).resolves.toEqual({ id: '1' });
    await expect(controller.update('1', { title: 'Updated' })).resolves.toEqual({ id: '1', title: 'Updated' });
    await expect(controller.publish('1')).resolves.toEqual({ id: '1', isPublished: true });
    await expect(controller.unpublish('1')).resolves.toEqual({ id: '1', isPublished: false });
    await expect(controller.remove('1')).resolves.toEqual({ message: 'Exam notice deleted successfully' });
  });
});