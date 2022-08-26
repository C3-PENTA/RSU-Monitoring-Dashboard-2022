import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { EventService } from '../../event/service/event.service';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);

  constructor(
    private eventService: EventService,
    private configService: ConfigService,
  ) {}

  /**
   * Job clear "Node Availability Status Transfer" Event 3 months ago
   */
