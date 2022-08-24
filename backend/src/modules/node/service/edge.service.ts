import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListNodeDto } from '../dto/list-node.dto';
import { Edge } from '../entity/edge.entity';

@Injectable()
export class EdgeService {
  constructor(
    @InjectRepository(Edge) private edgeRepository: Repository<Edge>,
  ) {}

  /**
   * Find all Edges with corresponding RSUs, OBUs
   * @returns {Promise<ListNodeDto>}
   */
  async findAll(): Promise<ListNodeDto> {
    const listEdge = await this.edgeRepository
      .createQueryBuilder('edge')
      .leftJoinAndSelect('edge.listRsu', 'rsu')
      .leftJoinAndSelect('rsu.listObu', 'obu')
      .orderBy('edge.name', 'ASC')
      .getMany();
    return { listEdge };
  }
}
