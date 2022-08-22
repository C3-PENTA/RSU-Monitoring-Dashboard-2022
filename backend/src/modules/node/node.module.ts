import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeController } from './controller/node.controller';
import { Edge } from './entity/edge.entity';
import { Obu } from './entity/obu.entity';
import { Rsu } from './entity/rsu.entity';
import { EdgeService } from './service/edge.service';
import { RsuService } from './service/rsu.service';

@Module({
  imports: [TypeOrmModule.forFeature([Edge, Rsu, Obu])],
  controllers: [NodeController],
  providers: [EdgeService, RsuService],
  exports: [EdgeService, RsuService],
})
export class NodeModule {}
