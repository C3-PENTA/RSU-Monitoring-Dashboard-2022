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

  @ApiProperty()
  @Column({ default: () => `''` })
  eventType: string;

  @ApiProperty()
  @Column({ default: () => `''` })
  status: string;

  @ApiProperty()
  @Column({ default: () => `''` })
  request: string;

  @ApiProperty()
  @Column({ default: () => `''` })
  action: string;

  @ApiProperty({ type: EventInfo })
  @Column('jsonb', { default: () => `'{}'::jsonb` })
  eventInfo: EventInfo;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'now()',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'now()',
    onUpdate: 'now()',
  })
  public updatedAt: Date;
}
