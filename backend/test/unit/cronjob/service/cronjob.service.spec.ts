import { Test, TestingModule } from '@nestjs/testing';
import { CronjobService } from '../../../../src/modules/cronjob/service/cronjob.service';
import { EventService } from '../../../../src/modules/event/service/event.service';
import { ConfigService } from '@nestjs/config';
import { Event } from '../../../../src/modules/event/entity/event.entity';
import { EmptyLogger } from '../../../mock/empty-logger';

describe('CronjobService', () => {
  let service: CronjobService;
  let fakeEventService: Partial<EventService>;
  let fakeConfigService: Partial<ConfigService>;
  const listEvent: Partial<Event>[] = [
    { id: 'EventId1', createdAt: new Date('2022-06-01T00:00:00.000Z') },
  ];

  beforeEach(async () => {
    fakeEventService = {
      deleteBeforeTime: (beforeTime: string) => {
        const event = listEvent.filter(
          (item) => item.createdAt.toISOString() < beforeTime,
        );
        return Promise.resolve({
          raw: event,
          affected: event.length,
        });
      },
    };
    fakeConfigService = {
      get: () => {
        return null;
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronjobService,
        {
          provide: EventService,
          useValue: fakeEventService,
        },
        {
          provide: ConfigService,
          useValue: fakeConfigService,
        },
      ],
    }).compile();

    module.useLogger(new EmptyLogger());
    service = module.get<CronjobService>(CronjobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('handleJobClearDataEvent run success with no env config and delete nothing', async () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2022, 4, 1));
    const deleteBeforeTimeSpy = jest.spyOn(
      fakeEventService,
      'deleteBeforeTime',
    );
    await service.handleJobClearDataEvent();
    expect(deleteBeforeTimeSpy).toHaveBeenCalledWith(
      new Date(2022, 1, 1).toISOString(),
    );
    expect(deleteBeforeTimeSpy).toHaveReturnedWith(
      Promise.resolve({
        raw: [],
        afftected: 0,
      }),
    );
    jest.useRealTimers();
  });

  it('handleJobClearDataEvent run success with no env config and delete 1', async () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2022, 10, 1));
    const deleteBeforeTimeSpy = jest.spyOn(
      fakeEventService,
      'deleteBeforeTime',
    );
    await service.handleJobClearDataEvent();
    expect(deleteBeforeTimeSpy).toHaveBeenCalledWith(
      new Date(2022, 7, 1).toISOString(),
    );
    expect(deleteBeforeTimeSpy).toHaveReturnedWith(
      Promise.resolve({
        raw: listEvent,
        afftected: 1,
      }),
    );
    jest.useRealTimers();
  });

  it('handleJobClearDataEvent run success with env config', async () => {
    fakeConfigService.get = () => {
      return 2;
    };
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2022, 6, 1));
    const deleteBeforeTimeSpy = jest.spyOn(
      fakeEventService,
      'deleteBeforeTime',
    );
    await service.handleJobClearDataEvent();
    expect(deleteBeforeTimeSpy).toHaveBeenCalledWith(
      new Date(2022, 4, 1).toISOString(),
    );
    jest.useRealTimers();
  });

  it('handleJobClearDataEvent run fail', async () => {
    fakeEventService.deleteBeforeTime = () => {
      throw new Error('Error');
    };
    const deleteBeforeTimeSpy = jest.spyOn(
      fakeEventService,
      'deleteBeforeTime',
    );
    await service.handleJobClearDataEvent();
    expect(deleteBeforeTimeSpy).toHaveBeenCalledTimes(1);
  });
});
