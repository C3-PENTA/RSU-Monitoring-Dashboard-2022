import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../entity/event.entity';

export class LoadMoreEventDto {
  @ApiProperty()
  hasNext: boolean;

  @ApiProperty({ type: Event, isArray: true })
  listEvent: Event[];
}
