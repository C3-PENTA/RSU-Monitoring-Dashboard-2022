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
   * Handle receive message from RSU, OBU & Send event to dashboard FE
   * @param {Socket} client
   * @param {EventDataDto} payload
   */
  @SubscribeMessage('event_to_server')
  async handleMessage(client: Socket, payload: EventDataDto): Promise<void> {
    const event = await this.eventService.create(payload);
    if (
      event.category === CategoryEnum.Node_Availability_Status_Transfer_Event
    ) {
      const cpuThreshold = this.configService.get<number>('CPU_THRESHOLD');
      const ramThreshold = this.configService.get<number>('RAM_THRESHOLD');
      const nicThreshold = this.configService.get<number>('NIC_THRESHOLD');

      if (
        event.eventInfo.cpu >= cpuThreshold ||
        event.eventInfo.ram >= ramThreshold ||
        event.eventInfo.nic.tx / event.eventInfo.nic.rx >= nicThreshold
      ) {
        await this._sendEventToClientWithDetectionNodeId(event);
      }
    } else if (event.category === CategoryEnum.Virus_Detection_Event) {
      await this._sendEventToClientWithDetectionNodeId(event);
    } else {
      this.server.emit('event_to_client', event);
    }

    if (payload.category === CategoryEnum.Node_Communication_Event) {
      setTimeout(() => {
        const node = payload.receiveNode.toLowerCase().replace(' ', '_');
        this.server.emit(`event_to_${node}`, payload);
      }, 2000);
    }
  }

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
