import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ExamNoticesService } from './exam-notices.service';

describe('ExamNoticesService', () => {
  let service: ExamNoticesService;
  let model: jest.Mock & {
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
  };

  beforeEach(async () => {
    model = jest.fn().mockImplementation((payload) => ({
      payload,
      save: jest.fn(),
    })) as unknown as typeof model;
    model.find = jest.fn();
    model.findById = jest.fn();
    model.findByIdAndUpdate = jest.fn();
    model.findByIdAndDelete = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ExamNoticesService,
        {
          provide: 'ExamNoticeModel',
          useValue: model,
        },
      ],
    })
      .overrideProvider('ExamNoticeModel')
      .useValue(model)
      .compile();

    service = moduleRef.get(ExamNoticesService);
    Reflect.set(service as unknown as { examNoticeModel: unknown }, 'examNoticeModel', model as never);
  });

  it('creates a notice and defaults unpublished notices to false', async () => {
    const save = jest.fn().mockResolvedValue({ id: '1', title: 'Mid Term', isPublished: false });
    model.mockImplementationOnce((payload) => ({
      payload,
      save,
    }));

    const result = await service.create({
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
    });

    expect(save).toHaveBeenCalled();
    expect(result).toEqual({ id: '1', title: 'Mid Term', isPublished: false });
  });

  it('returns all notices ordered by publish state and date', async () => {
    const sort = jest.fn().mockResolvedValue([{ id: '1' }]);
    model.find.mockReturnValue({ sort });

    await expect(service.findAll()).resolves.toEqual([{ id: '1' }]);
    expect(model.find).toHaveBeenCalled();
    expect(sort).toHaveBeenCalledWith({ isPublished: -1, date: 1, createdAt: -1 });
  });

  it('returns only published notices for the public feed', async () => {
    const sort = jest.fn().mockResolvedValue([{ id: 'pub' }]);
    model.find.mockReturnValue({ sort });

    await expect(service.findPublished()).resolves.toEqual([{ id: 'pub' }]);
    expect(model.find).toHaveBeenCalledWith({ isPublished: true });
  });

  it('throws when a notice is missing', async () => {
    model.findById.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates a notice and flips publish timestamp when publishing', async () => {
    model.findByIdAndUpdate.mockResolvedValue({ id: '1', isPublished: true });

    const result = await service.update('1', {
      title: 'Updated',
      isPublished: true,
    });

    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ title: 'Updated', isPublished: true, publishedAt: expect.any(Date) }),
      expect.objectContaining({ new: true, runValidators: true }),
    );
    expect(result).toEqual({ id: '1', isPublished: true });
  });

  it('publishes, unpublishes, and deletes notices', async () => {
    model.findByIdAndUpdate
      .mockResolvedValueOnce({ id: '1', isPublished: true })
      .mockResolvedValueOnce({ id: '1', isPublished: false });
    model.findByIdAndDelete.mockResolvedValue({ id: '1' });

    await expect(service.publish('1')).resolves.toEqual({ id: '1', isPublished: true });
    await expect(service.unpublish('1')).resolves.toEqual({ id: '1', isPublished: false });
    await expect(service.remove('1')).resolves.toEqual({ message: 'Exam notice deleted successfully' });
  });
});