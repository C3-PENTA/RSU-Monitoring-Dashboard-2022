import { Module } from '@nestjs/common';
import { EventModule } from '../event/event.module';
import { CronjobService } from './service/cronjob.service';

@Module({
  imports: [EventModule],
  providers: [CronjobService],
})
export class CronjobModule {}
