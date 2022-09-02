import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RsuService } from '../../../modules/node/service/rsu.service';
import {
  Brackets,
  DeleteResult,
  LessThan,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { EventDataDto } from '../dto/event-data.dto';
import { QueryLoadMoreEventBodyDto } from '../dto/query-load-more-event-body.dto';
import { QueryPagingEventBodyDto } from '../dto/query-paging-event-body.dto';
import { Event } from '../entity/event.entity';
import { CategoryEnum } from '../enum/category.enum';
import { PaginationEventDto } from '../dto/pagination-event.dto';
import { LoadMoreEventDto } from '../dto/load-more-event.dto';
import { QuerySearchEventBodyDto } from '../dto/query-search-event-body.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private configService: ConfigService,
    private rsuService: RsuService,
  ) {}

  /**
   * Find all event with paging
   * @param {QueryPagingEventBodyDto} queryEventBody
   * @returns {Promise<PaginationEventDto>}
   */
  async findAllPaging(
    queryEventBody: QueryPagingEventBodyDto,
  ): Promise<PaginationEventDto> {
    const { page, size, category, keyword, startTime, endTime } =
      queryEventBody;

    if (category.length === 0) {
      return {
        totalRecords: 0,
        totalPages: 0,
        currentPage: page,
        listEvent: [],
      };
    }

    const offset = (page - 1) * size;

    let queryBuilder = this._createDefaultQueryBuilderFindAll();

    queryBuilder = this._updateQueryBuilderFindAllBySearchQuery(queryBuilder, {
      category,
      keyword,
      startTime,
      endTime,
    });

    queryBuilder = this._orderByCreatedAt(queryBuilder);

    queryBuilder = queryBuilder.skip(offset).take(size);

    const [listEvent, totalRecords] = await Promise.all([
      queryBuilder.getRawMany(),
      queryBuilder.getCount(),
    ]);

    return {
      totalRecords,
      totalPages: Math.ceil(totalRecords / size),
      currentPage: page,
      listEvent,
    };
  }

  /**
   * Find all event with load more
   * @param {QueryLoadMoreEventBodyDto} queryEventBody
   * @returns {Promise<LoadMoreEventDto>}
   */
  async findAllLoadMore(
    queryEventBody: QueryLoadMoreEventBodyDto,
  ): Promise<LoadMoreEventDto> {
    const {
      size,
      lastRecordCreatedTime,
      category,
      keyword,
      startTime,
      endTime,
    } = queryEventBody;

    if (category.length === 0) {
      return {
        hasNext: false,
        listEvent: [],
      };
    }

    let queryBuilder = this._createDefaultQueryBuilderFindAll();

    if (lastRecordCreatedTime) {
      queryBuilder = this._getQueryBuilderForLastRecordCreatedTime(
        queryBuilder,
        lastRecordCreatedTime,
      );
    }

    queryBuilder = this._updateQueryBuilderFindAllBySearchQuery(queryBuilder, {
      category,
      keyword,
      startTime,
      endTime,
    });

    queryBuilder = this._orderByCreatedAt(queryBuilder);

    queryBuilder = queryBuilder.take(size + 1);

    const listEvent = await queryBuilder.getRawMany();

    let hasNext = false;
    if (listEvent.length > size) {
      hasNext = true;
      listEvent.length = size;
    }

    return {
      hasNext,
      listEvent,
    };
  }

  /**
   * Create Event
   * If category is "Node_Availability_Status_Transfer", update current rsu info
   * @param {EventDataDto} eventData
   * @returns {Promise<Event>}
   */
  async create(eventData: EventDataDto): Promise<Event> {
    if (
      eventData.category ===
      CategoryEnum.Node_Availability_Status_Transfer_Event
    ) {
      await this.rsuService.update(
        {
          name: eventData.detectionNode,
        },
        {
          cpu: eventData.eventInfo.cpu,
          ram: eventData.eventInfo.ram,
          tx: eventData.eventInfo.nic.tx,
          rx: eventData.eventInfo.nic.rx,
        },
      );
    }
    const event = this.eventRepository.create(eventData);
    return this.eventRepository.save(event);
  }

  /**
   * Delete events that have Node_Availability_Status_Transfer category before input time
   * @param {string} beforeTime DateISOString (Exp: 2022-01-01T00:00:00.000Z)
   * @returns {Promise<DeleteResult>}
   */
  deleteBeforeTime(beforeTime: string): Promise<DeleteResult> {
    return this.eventRepository.delete({
      category: CategoryEnum.Node_Availability_Status_Transfer_Event,
      createdAt: LessThan(beforeTime),
    });
  }

  /**
   * Create default query builder find all event
   * @returns {SelectQueryBuilder<Event>}
   */
  _createDefaultQueryBuilderFindAll(): SelectQueryBuilder<Event> {
    return this.eventRepository
      .createQueryBuilder('event')
      .select([
        '"event"."id"',
        '"event"."category"',
        '"event"."sendNode"',
        '"event"."receiveNode"',
        '"event"."detectionNode"',
        '"event"."eventType"',
        '"event"."status"',
        '"event"."request"',
        '"event"."action"',
        '"event"."eventInfo"',
        '"event"."createdAt"',
      ])
      .where('1 = 1');
  }

  /**
   * Update query builder find all by search category, keyword, start time & end time
   * @param {SelectQueryBuilder<Event>} queryBuilder
   * @param {QuerySearchEventBodyDto} querySearchEventBody
   * @returns {SelectQueryBuilder<Event>}
   */
  _updateQueryBuilderFindAllBySearchQuery(
    queryBuilder: SelectQueryBuilder<Event>,
    querySearchEventBody: QuerySearchEventBodyDto,
  ): SelectQueryBuilder<Event> {
    const { category, keyword, startTime, endTime } = querySearchEventBody;

    if (category.length > 0) {
      queryBuilder = this._getQueryBuilderForCategory(
        queryBuilder,
        category,
      ).queryBuilder;
    }

    if (keyword) {
      queryBuilder = this._getQueryBuilderForKeyWord(
        queryBuilder,
        keyword,
      ).queryBuilder;
    }

    if (startTime) {
      queryBuilder = this._getQueryBuilderForStartTime(queryBuilder, startTime);
    }

    if (endTime) {
      queryBuilder = this._getQueryBuilderForEndTime(queryBuilder, endTime);
    }

    return queryBuilder;
  }

  /**
   * Get query builder when ordering by createdAt descending
   * @param {SelectQueryBuilder<Event>} queryBuilder
   * @returns {SelectQueryBuilder<Event>}
   */
  _orderByCreatedAt(
    queryBuilder: SelectQueryBuilder<Event>,
  ): SelectQueryBuilder<Event> {
    return queryBuilder.orderBy('"event"."createdAt"', 'DESC');
  }

  /**
   * Get query builder for searching category
   * @param {SelectQueryBuilder<Event>} queryBuilder
   * @param {number[]} category
   * @returns
   */
  _getQueryBuilderForCategory(
    queryBuilder: SelectQueryBuilder<Event>,
    category: number[],
  ) {
    let subConditionQueryForCpuRamNic: {
      (qb: WhereExpressionBuilder): any;
      (subconditionQuery: WhereExpressionBuilder): WhereExpressionBuilder;
      (qb: WhereExpressionBuilder): any;
    };

    let subConditionOrWhereQueryForMultipleCategoryInclude1: {
      (qb: WhereExpressionBuilder): any;
      (subconditionQuery: WhereExpressionBuilder): WhereExpressionBuilder;
    };

    let subConditionQueryForMultipleCategoryInclude1: {
      (subconditionQuery: WhereExpressionBuilder): WhereExpressionBuilder;
      (qb: WhereExpressionBuilder): any;
    };

    if (
      category.includes(CategoryEnum.Node_Availability_Status_Transfer_Event)
    ) {
      subConditionQueryForCpuRamNic = (
        subconditionQuery: WhereExpressionBuilder,
      ) => {
        const cpuThreshold = this.configService.get<number>('CPU_THRESHOLD');
        const ramThreshold = this.configService.get<number>('RAM_THRESHOLD');
        const nicThreshold = this.configService.get<number>('NIC_THRESHOLD');
        return subconditionQuery
          .where(`("event"."eventInfo" ->> 'cpu')::integer > ${cpuThreshold}`)
          .orWhere(`("event"."eventInfo" ->> 'ram')::integer > ${ramThreshold}`)
          .orWhere(
            `("event"."eventInfo" -> 'nic' ->> 'tx')::integer / ("event"."eventInfo" -> 'nic' ->> 'rx')::integer > ${nicThreshold}`,
          );
      };

      if (category.length === 1) {
        queryBuilder = queryBuilder
          .andWhere(
            `event.category = ${CategoryEnum.Node_Availability_Status_Transfer_Event}`,
          )
          .andWhere(new Brackets(subConditionQueryForCpuRamNic));
      } else {
        subConditionOrWhereQueryForMultipleCategoryInclude1 = (
          subconditionQuery: WhereExpressionBuilder,
        ) => {
          return subconditionQuery
            .where(
              `event.category = ${CategoryEnum.Node_Availability_Status_Transfer_Event}`,
            )
            .andWhere(new Brackets(subConditionQueryForCpuRamNic));
        };

        subConditionQueryForMultipleCategoryInclude1 = (
          subconditionQuery: WhereExpressionBuilder,
        ) => {
          return subconditionQuery
            .where('event.category in (:...category)', {
              category: category.filter(
                (item) =>
                  item !== CategoryEnum.Node_Availability_Status_Transfer_Event,
              ),
            })
            .orWhere(
              new Brackets(subConditionOrWhereQueryForMultipleCategoryInclude1),
            );
        };

        queryBuilder = queryBuilder.andWhere(
          new Brackets(subConditionQueryForMultipleCategoryInclude1),
        );
      }
    } else {
      queryBuilder = queryBuilder.andWhere('event.category in (:...category)', {
        category,
      });
    }

    return {
      subConditionQueryForCpuRamNic,
      subConditionOrWhereQueryForMultipleCategoryInclude1,
      subConditionQueryForMultipleCategoryInclude1,
      queryBuilder,
    };
  }

  /**
   * Get query builder for searching keyword
   * @param {SelectQueryBuilder<Event>} queryBuilder
   * @param {string} keyword
   * @returns
   */
  _getQueryBuilderForKeyWord(
    queryBuilder: SelectQueryBuilder<Event>,
    keyword: string,
  ) {
    const subConditionQueryForKeyword = (
      subconditionQuery: WhereExpressionBuilder,
    ) => {
      subconditionQuery
        .where(`"event"."sendNode" iLike :keyword`, {
          keyword: `%${keyword}%`,
        })
        .orWhere(`"event"."receiveNode" iLike :keyword`, {
          keyword: `%${keyword}%`,
        })
        .orWhere(`"event"."detectionNode" iLike :keyword`, {
          keyword: `%${keyword}%`,
        });
    };

    return {
      subConditionQueryForKeyword,
      queryBuilder: queryBuilder.andWhere(
        new Brackets(subConditionQueryForKeyword),
      ),
    };
  }

  /**
   * Get query builder for searching start time
   * @param {SelectQueryBuilder<Event>} queryBuilder
   * @param {string} startTime DateISOString (Exp: 2022-01-01T00:00:00.000Z)
   * @returns {SelectQueryBuilder<Event>}
   */
  _getQueryBuilderForStartTime(
    queryBuilder: SelectQueryBuilder<Event>,
    startTime: string,
  ): SelectQueryBuilder<Event> {
    return queryBuilder.andWhere(`"event"."createdAt" >= :startTime`, {
      startTime,
    });
  }

  /**
   * Get query builder for searching end time
   * @param {SelectQueryBuilder<Event>} queryBuilder
   * @param {string} endTime DateISOString (Exp: 2022-01-01T00:00:00.000Z)
   * @returns {SelectQueryBuilder<Event>}
   */
  _getQueryBuilderForEndTime(
    queryBuilder: SelectQueryBuilder<Event>,
    endTime: string,
  ): SelectQueryBuilder<Event> {
    return queryBuilder.andWhere(`"event"."createdAt" <= :endTime`, {
      endTime,
    });
  }

  /**
   * Get query builder for searching records before lastRecordCreatedTime input
   * @param {SelectQueryBuilder<Event>} queryBuilder
   * @param {string} lastRecordCreatedTime DateISOString (Exp: 2022-01-01T00:00:00.000Z)
   * @returns {SelectQueryBuilder<Event>}
   */
  _getQueryBuilderForLastRecordCreatedTime(
    queryBuilder: SelectQueryBuilder<Event>,
    lastRecordCreatedTime: string,
  ) {
    return queryBuilder.andWhere(
      `"event"."createdAt" < :lastRecordCreatedTime`,
      {
        lastRecordCreatedTime,
      },
    );
  }
}
