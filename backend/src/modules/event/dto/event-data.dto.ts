import { ApiProperty } from '@nestjs/swagger';
import { EventInfo } from '../type/event-info.type';

export class EventDataDto {
  @ApiProperty()
  category: number;

  
}
