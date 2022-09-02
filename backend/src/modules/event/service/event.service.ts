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

