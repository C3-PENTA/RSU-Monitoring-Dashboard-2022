import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { EventService } from './modules/event/service/event.service';
import { ConfigService } from '@nestjs/config';
import { CategoryEnum } from './modules/event/enum/category.enum';
import { EventDataDto } from './modules/event/dto/event-data.dto';
import { RsuService } from './modules/node/service/rsu.service';
import { Event } from './modules/event/entity/event.entity';
import 'dotenv/config';

