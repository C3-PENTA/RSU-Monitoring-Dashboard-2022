import { ApiProperty } from '@nestjs/swagger';
import { NIC } from './nic.type';

export class EventInfo {
  @ApiProperty()
  cpu: number;

  @ApiProperty()
  ram: number;

  @ApiProperty()
  nic: NIC;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  info: string;
}
