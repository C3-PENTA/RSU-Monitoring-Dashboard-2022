import { ApiProperty } from '@nestjs/swagger';

export class NIC {
  @ApiProperty()
  tx: number;

  @ApiProperty()
  rx: number;
}
