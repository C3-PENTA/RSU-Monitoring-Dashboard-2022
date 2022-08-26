import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeModule } from '../node/node.module';
import { EventController } from './controller/event.controller';
import { Event } from './entity/event.entity';
import { EventService } from './service/event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), NodeModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
