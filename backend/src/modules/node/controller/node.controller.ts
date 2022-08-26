import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListNodeDto } from '../dto/list-node.dto';
import { EdgeService } from '../service/edge.service';


