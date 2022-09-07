import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Min, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { QuerySearchEventBodyDto } from './query-search-event-body.dto';

export class QueryLoadMoreEventBodyDto extends QuerySearchEventBodyDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  size: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  lastRecordCreatedTime: string;
}
