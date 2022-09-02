import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationEventDto } from '../dto/pagination-event.dto';
import { QueryPagingEventBodyDto } from '../dto/query-paging-event-body.dto';
import { QueryLoadMoreEventBodyDto } from '../dto/query-load-more-event-body.dto';
import { EventService } from '../service/event.service';
import { LoadMoreEventDto } from '../dto/load-more-event.dto';

@ApiTags('Event')
@Controller('event')