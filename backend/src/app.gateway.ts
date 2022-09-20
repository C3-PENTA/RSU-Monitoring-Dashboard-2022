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

@WebSocketGateway({
  cors: {
    origin: process.env.FE_URL ? process.env.FE_URL.split(',') : '*',
    credentials: true,
    preflightContinue: false,
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private eventService: EventService,
    private rsuService: RsuService,
    private configService: ConfigService,
  ) {}

  private logger: Logger = new Logger('AppGateway');



  /**
   * Handle after init socket
   * @param {Server} server
   */
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  /**
   * Handle disconnect
   * @param {Socket} client
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Handle client connection
   * @param {Socket} client
   * @param {any[]} args
   */
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Send event to Dashboard FE with addition detectionNodeId
   * @param {Event} event
   */
  async _sendEventToClientWithDetectionNodeId(event: Event) {
    const rsu = await this.rsuService.findOne({
      name: event.detectionNode,
    });
    this.server.emit('event_to_client', {
      ...event,
      detectionNodeId: rsu.id,
    });
  }
}
