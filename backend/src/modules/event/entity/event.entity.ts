import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventInfo } from '../type/event-info.type';

@Entity()
export class Event {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  category: number;

  @Column()
  sendNodeType: string;

  @ApiProperty()
  @Column()
  sendNode: string;

  @Column({ default: () => `''` })
  receiveNodeType: string;

  @ApiProperty()
  @Column({ default: () => `''` })
  receiveNode: string;

  @Column({ default: () => `''` })
  detectionNodeType: string;

  @ApiProperty()
  @Column({ default: () => `''` })
  detectionNode: string;


}
