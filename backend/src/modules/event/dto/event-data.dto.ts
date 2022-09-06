import { ApiProperty } from '@nestjs/swagger';
import { EventInfo } from '../type/event-info.type';

export class EventDataDto {
  @ApiProperty()
  category: number;

  @ApiProperty()
  sendNode: string;

  @ApiProperty()
  receiveNode: string;

  @ApiProperty()
  detectionNode: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  request: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  eventInfo: EventInfo;
}
