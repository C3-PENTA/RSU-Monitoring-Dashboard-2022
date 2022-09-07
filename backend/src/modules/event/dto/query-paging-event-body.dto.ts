import { ApiProperty } from '@nestjs/swagger';
import { Min, IsNumber } from 'class-validator';
import { QuerySearchEventBodyDto } from './query-search-event-body.dto';

export class QueryPagingEventBodyDto extends QuerySearchEventBodyDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  size: number;
}
