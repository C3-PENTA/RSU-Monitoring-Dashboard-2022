import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rsu } from '../entity/rsu.entity';

@Injectable()
export class RsuService {
  constructor(@InjectRepository(Rsu) private rsuRepository: Repository<Rsu>) {}

  /**
   * Find one Rsu
   * @param {Partial<Rsu>} whereCondition
   * @returns {Promise<Rsu>}
   */
  async findOne(whereCondition: Partial<Rsu>): Promise<Rsu> {
    return this.rsuRepository.findOne({
      where: whereCondition,
    });
  }

  /**
   * Update Rsu
   * @param {Partial<Rsu>} whereCondition
   * @param {Partial<Rsu>} attrs
   * @returns {Promise<Rsu>}
   * @throws {NotFoundException}
   */
  async update(
    whereCondition: Partial<Rsu>,
    attrs: Partial<Rsu>,
  ): Promise<Rsu> {
    const rsu = await this.rsuRepository.findOne({
      where: whereCondition,
    });
    if (rsu) {
      Object.assign(rsu, attrs);
      return this.rsuRepository.save(rsu);
    } else {
      throw new NotFoundException('Rsu not found');
    }
  }
}
