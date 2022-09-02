import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationEventDto } from '../dto/pagination-event.dto';
import { QueryPagingEventBodyDto } from '../dto/query-paging-event-body.dto';
import { QueryLoadMoreEventBodyDto } from '../dto/query-load-more-event-body.dto';
import { EventService } from '../service/event.service';
import { LoadMoreEventDto } from '../dto/load-more-event.dto';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('search/paging')
  @ApiOperation({
    description: `<b>Search & Get List Event</b> <br><br>
      Category: 1 - Node Availability Status Transfer Event, 2 - Virus Detection Event, 3 - Node Communication Event`,
  })
  @ApiOkResponse({
    status: 200,
    description: 'List Event Response',
    type: PaginationEventDto,
  })
  listEventPaging(@Body() query: QueryPagingEventBodyDto) {
    return this.eventService.findAllPaging(query);
  }

  @Post('search/load-more')
  @ApiOperation({
    description: `<b>Search Load More & Get List Event</b> <br><br>
      Category: 1 - Node Availability Status Transfer Event, 2 - Virus Detection Event, 3 - Node Communication Event`,
  })
  @ApiOkResponse({
    status: 200,
    description: 'List Event Response',
    type: LoadMoreEventDto,
  })
  listEventLoadMore(@Body() query: QueryLoadMoreEventBodyDto) {
    return this.eventService.findAllLoadMore(query);
  }
}
