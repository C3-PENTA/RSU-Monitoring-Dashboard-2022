import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../../../src/modules/event/entity/event.entity';
import { MockType } from '../../../mock/mock-type';
import { fakeRepositoryFactory } from '../../../mock/mock-repository-factory';
import { EventService } from '../../../../src/modules/event/service/event.service';
import { Rsu } from '../../../../src/modules/node/entity/rsu.entity';
import { ConfigService } from '@nestjs/config';
import { RsuService } from '../../../../src/modules/node/service/rsu.service';
import { EventDataDto } from '../../../../src/modules/event/dto/event-data.dto';
import { EventInfo } from '../../../../src/modules/event/type/event-info.type';
import { NIC } from '../../../../src/modules/event/type/nic.type';
import { QueryLoadMoreEventBodyDto } from '../../../../src/modules/event/dto/query-load-more-event-body.dto';
import { QueryPagingEventBodyDto } from '../../../../src/modules/event/dto/query-paging-event-body.dto';
import { mockSubconditionQuery } from '../../../mock/mock-subcondition-query';

describe('EventService', () => {
  let service: EventService;
  let fakeEventRepository: MockType<Repository<Event>>;
  let fakeConfigService: Partial<ConfigService>;
  let fakeRsuService: Partial<RsuService>;

  beforeEach(async () => {
    fakeConfigService = {
      get: () => {
        return null;
      },
    };

    fakeRsuService = {
      update: () => {
        return Promise.resolve(new Rsu());
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useFactory: fakeRepositoryFactory,
        },
        {
          provide: ConfigService,
          useValue: fakeConfigService,
        },
        {
          provide: RsuService,
          useValue: fakeRsuService,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    fakeEventRepository = module.get(getRepositoryToken(Event));
    fakeEventRepository.create = jest.fn((event: Event) => event);
    fakeEventRepository.save = jest.fn((event: Event) => event);
    fakeEventRepository.delete = jest.fn(() => {
      return {
        raw: [],
        affected: 0,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(fakeEventRepository).toBeDefined();
  });

  it('findAllPaging with category = []', async () => {
    const queryEventBody = new QueryPagingEventBodyDto();
    queryEventBody.page = 1;
    queryEventBody.category = [];
    const response = await service.findAllPaging(queryEventBody);
    expect(response).toBeDefined();
    expect(response.totalRecords).toEqual(0);
    expect(response.totalPages).toEqual(0);
    expect(response.currentPage).toEqual(1);
    expect(response.listEvent).toEqual([]);
  });

  it('findAllPaging with all params', async () => {
    const queryEventBody = new QueryPagingEventBodyDto();
    queryEventBody.page = 1;
    queryEventBody.size = 10;
    queryEventBody.category = [1];
    const response = await service.findAllPaging(queryEventBody);
    expect(response).toBeDefined();
    expect(response.totalRecords).toEqual(10);
    expect(response.totalPages).toEqual(1);
    expect(response.currentPage).toEqual(1);
    expect(response.listEvent.length).toEqual(10);
  });

  it('findAllLoadMore with category = []', async () => {
    const queryEventBody = new QueryLoadMoreEventBodyDto();
    queryEventBody.category = [];
    const response = await service.findAllLoadMore(queryEventBody);
    expect(response).toBeDefined();
    expect(response.hasNext).toEqual(false);
    expect(response.listEvent).toEqual([]);
  });

  it('findAllLoadMore with all params', async () => {
    const queryEventBody = new QueryLoadMoreEventBodyDto();
    queryEventBody.category = [1];
    queryEventBody.size = 1;
    queryEventBody.lastRecordCreatedTime = '2022-01-03T00:00:00.000Z';
    const response = await service.findAllLoadMore(queryEventBody);
    expect(response).toBeDefined();
    expect(response.hasNext).toEqual(true);
    expect(response.listEvent.length).toEqual(1);
  });

  it('create with category 1', async () => {
    const eventDataDto = new EventDataDto();
    eventDataDto.category = 1;
    eventDataDto.sendNode = 'RSU 1';
    eventDataDto.receiveNode = 'OBU 1';
    eventDataDto.detectionNode = 'OBU 1';
    eventDataDto.status = 'status';
    eventDataDto.request = 'request';
    eventDataDto.action = 'Stop';
    const eventInfo = new EventInfo();
    eventInfo.cpu = 1;
    eventInfo.ram = 2;
    const nic = new NIC();
    nic.tx = 3;
    nic.rx = 4;
    eventInfo.nic = nic;
    eventDataDto.eventInfo = eventInfo;
    const response = await service.create(eventDataDto);
    expect(response).toBeDefined();
    expect(response.category).toEqual(1);
  });

  it('deleteBeforeTime return success', async () => {
    const response = await service.deleteBeforeTime('2022-01-02T00:00:00.000Z');
    expect(response).toBeDefined();
    expect(response.raw).toEqual([]);
    expect(response.affected).toEqual(0);
  });

  it('_createDefaultQueryBuilderFindAll return success', () => {
    const response = service._createDefaultQueryBuilderFindAll();
    expect(response).toBeDefined();
  });

  it('_updateQueryBuilderFindAllBySearchQuery return success', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const response = service._updateQueryBuilderFindAllBySearchQuery(
      queryBuilder,
      {
        category: [1],
        keyword: '1',
        startTime: '2022-01-01T00:00:00.000Z',
        endTime: '2023-01-01T00:00:00.000Z',
      },
    );
    expect(response).toBeDefined();
  });

  it('_orderByCreatedAt return success with order descesding', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const queryBuilderOrderBySpy = jest.spyOn(queryBuilder, 'orderBy');
    const response = service._orderByCreatedAt(queryBuilder);
    expect(queryBuilderOrderBySpy).toHaveBeenCalledWith(
      '"event"."createdAt"',
      'DESC',
    );
    expect(response).toBeDefined();
  });

  it('_getQueryBuilderForCategory with category = [1] return success', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const queryBuilderAndWhereSpy = jest.spyOn(queryBuilder, 'andWhere');
    const response = service._getQueryBuilderForCategory(queryBuilder, [1]);
    response.subConditionQueryForCpuRamNic(mockSubconditionQuery);
    expect(response).toBeDefined();
    expect(typeof response.subConditionQueryForCpuRamNic).toBe<string>(
      'function',
    );
    expect(response.queryBuilder).toBeDefined();
    expect(queryBuilderAndWhereSpy).toHaveBeenCalledTimes(2);
  });

  it('_getQueryBuilderForCategory with category = [1, 2] return success', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const queryBuilderAndWhereSpy = jest.spyOn(queryBuilder, 'andWhere');
    const response = service._getQueryBuilderForCategory(queryBuilder, [1, 2]);
    response.subConditionQueryForCpuRamNic(mockSubconditionQuery);
    response.subConditionOrWhereQueryForMultipleCategoryInclude1(
      mockSubconditionQuery,
    );
    response.subConditionQueryForMultipleCategoryInclude1(
      mockSubconditionQuery,
    );
    expect(response).toBeDefined();
    expect(typeof response.subConditionQueryForCpuRamNic).toBe<string>(
      'function',
    );
    expect(
      typeof response.subConditionOrWhereQueryForMultipleCategoryInclude1,
    ).toBe<string>('function');
    expect(
      typeof response.subConditionQueryForMultipleCategoryInclude1,
    ).toBe<string>('function');
    expect(response.queryBuilder).toBeDefined();
    expect(queryBuilderAndWhereSpy).toHaveBeenCalledTimes(1);
  });

  it('_getQueryBuilderForCategory with category = [2, 3] return success', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const queryBuilderAndWhereSpy = jest.spyOn(queryBuilder, 'andWhere');
    const response = service._getQueryBuilderForCategory(queryBuilder, [2, 3]);
    expect(response).toBeDefined();
    expect(response.queryBuilder).toBeDefined();
    expect(queryBuilderAndWhereSpy).toHaveBeenCalledTimes(1);
  });

  it('_getQueryBuilderForKeyWord return success', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const queryBuilderAndWhereSpy = jest.spyOn(queryBuilder, 'andWhere');
    const response = service._getQueryBuilderForKeyWord(
      queryBuilder,
      'keyword',
    );
    response.subConditionQueryForKeyword(mockSubconditionQuery);
    expect(response).toBeDefined();
    expect(typeof response.subConditionQueryForKeyword).toBe<string>(
      'function',
    );
    expect(response.queryBuilder).toBeDefined();
    expect(queryBuilderAndWhereSpy).toHaveBeenCalledTimes(1);
  });

  it('_getQueryBuilderForStartTime return success', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const queryBuilderAndWhereSpy = jest.spyOn(queryBuilder, 'andWhere');
    const response = service._getQueryBuilderForStartTime(
      queryBuilder,
      '2022-02-01T00:00:00.000Z',
    );
    expect(response).toBeDefined();
    expect(queryBuilderAndWhereSpy).toHaveBeenCalledTimes(1);
  });

  it('_getQueryBuilderForEndTime return success', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const queryBuilderAndWhereSpy = jest.spyOn(queryBuilder, 'andWhere');
    const response = service._getQueryBuilderForEndTime(
      queryBuilder,
      '2022-03-01T00:00:00.000Z',
    );
    expect(response).toBeDefined();
    expect(queryBuilderAndWhereSpy).toHaveBeenCalledTimes(1);
  });

  it('_getQueryBuilderForLastRecordCreatedTime return success', () => {
    const queryBuilder = service._createDefaultQueryBuilderFindAll();
    const queryBuilderAndWhereSpy = jest.spyOn(queryBuilder, 'andWhere');
    const response = service._getQueryBuilderForLastRecordCreatedTime(
      queryBuilder,
      '2022-04-01T00:00:00.000Z',
    );
    expect(response).toBeDefined();
    expect(queryBuilderAndWhereSpy).toHaveBeenCalledTimes(1);
  });
});
