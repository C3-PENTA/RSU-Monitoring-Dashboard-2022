import { ApiProperty } from '@nestjs/swagger';
import { Edge } from '../entity/edge.entity';

export class ListNodeDto {
  @ApiProperty({ type: Edge, isArray: true })
  listEdge: Edge[];
}
