import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class QuerySearchEventBodyDto {
  @ApiProperty({
    type: [Number],
    description:
      '1 - Node Availability Status Transfer Event, 2 - Virus Detection Event, 3 - Node Communication Event',
  })
  @IsNumber({}, { each: true })
  category: number[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startTime: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endTime: string;
}
