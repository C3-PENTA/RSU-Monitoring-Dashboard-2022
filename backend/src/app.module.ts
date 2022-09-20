import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/database/typeorm-config.service';
import { NodeModule } from './modules/node/node.module';
import { EventModule } from './modules/event/event.module';
import { AppGateway } from './app.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobModule } from './modules/cronjob/cronjob.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ScheduleModule.forRoot(),
    CronjobModule,
    NodeModule,
    EventModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
