import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../entity/event.entity';

export class PaginationEventDto {
  @ApiProperty()
  totalRecords: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty({ type: Event, isArray: true })
  listEvent: Event[];
}
