import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Edge } from './edge.entity';
import { Obu } from './obu.entity';

@Entity()
export class Rsu {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  cpu: number;

  @ApiProperty()
  @Column()
  ram: number;

  @ApiProperty()
  @Column()
  tx: number;

  @ApiProperty()
  @Column()
  rx: number;

  @ApiProperty({ type: Obu, isArray: true })
  @OneToMany(() => Obu, (opu) => opu.rsu)
  listObu: Obu[];

  @ManyToOne(() => Edge, (edge) => edge.listRsu)
  edge: Edge;

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
