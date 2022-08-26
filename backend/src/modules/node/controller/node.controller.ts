import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListNodeDto } from '../dto/list-node.dto';
import { EdgeService } from '../service/edge.service';


@ApiTags('Node')
@Controller('node')
export class NodeController {
  constructor(private edgeService: EdgeService) {}

  @Get('list')
  @ApiOperation({
    description: `<b>Get All Edges, RSUs, OBUs</b>`,
  })
  
}