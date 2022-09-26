import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from '../../../../src/modules/event/controller/event.controller';
import { EventService } from '../../../../src/modules/event/service/event.service';
import { QueryPagingEventBodyDto } from '../../../../src/modules/event/dto/query-paging-event-body.dto';
import { QueryLoadMoreEventBodyDto } from '../../../../src/modules/event/dto/query-load-more-event-body.dto';
import { Event } from '../../../../src/modules/event/entity/event.entity';

describe('EventController', () => {
  let controller: EventController;
  let fakeEventService: Partial<EventService>;

  beforeEach(async () => {
    fakeEventService = {
      findAllPaging: (queryEventBody: QueryPagingEventBodyDto) => {
        const totalRecords = 10;
        return Promise.resolve({
          totalRecords,
          totalPages: Math.ceil(totalRecords / queryEventBody.size),
          currentPage: queryEventBody.page,
          listEvent: Array.from(
            { length: queryEventBody.size },
            () => new Event(),
          ),
        });
      },
      findAllLoadMore: (queryEventBody: QueryLoadMoreEventBodyDto) => {
        return Promise.resolve({
          hasNext: queryEventBody.size < 2,
          listEvent: Array.from(
            { length: queryEventBody.size },
            () => new Event(),
          ),
        });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: fakeEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('listEventPaging returns an array', async () => {
    const page = 1;
    const size = 1;
    const events = await controller.listEventPaging({
      page,
      size,
    } as QueryPagingEventBodyDto);
    expect(events.totalRecords).toEqual(10);
    expect(events.totalPages).toEqual(10);
    expect(events.currentPage).toEqual(page);
    expect(events.listEvent.length).toEqual(size);
  });

  it('listEventLoadMore returns an array with hasNext true', async () => {
    const size = 1;
    const events = await controller.listEventLoadMore({
      size,
    } as QueryLoadMoreEventBodyDto);
    expect(events.hasNext).toEqual(true);
    expect(events.listEvent.length).toEqual(size);
  });

  it('listEventLoadMore returns an array with hasNext false', async () => {
    const size = 10;
    const events = await controller.listEventLoadMore({
      size,
    } as QueryLoadMoreEventBodyDto);
    expect(events.hasNext).toEqual(false);
    expect(events.listEvent.length).toEqual(size);
  });
});
