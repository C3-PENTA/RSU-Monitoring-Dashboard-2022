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
  @Cron('0 0 0 * * *')
  async handleJobClearDataEvent() {
    try {
      const today = new Date().toISOString();
      this.logger.log('Job run: ' + today);

      const TIME_INTERVAL_CLEAR_DATA_EVENT =
        this.configService.get<number>('TIME_INTERVAL_CLEAR_DATA_EVENT') || 3;

      const timeClearDataEvent = moment(today)
        .subtract(TIME_INTERVAL_CLEAR_DATA_EVENT, 'months')
        .toISOString();
      this.logger.log('timeClearDataEvent: ' + timeClearDataEvent);

      const result = await this.eventService.deleteBeforeTime(
        timeClearDataEvent,
      );
      this.logger.log('result: ' + JSON.stringify(result));
    } catch (e) {
      this.logger.error('Clear data event error: ', (e as Error).stack);
    }
  }
}
