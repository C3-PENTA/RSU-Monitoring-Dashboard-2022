import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from '../../../../src/modules/node/entity/edge.entity';
import { Rsu } from '../../../../src/modules/node/entity/rsu.entity';
import { MockType } from '../../../mock/mock-type';
import { fakeRepositoryFactory } from '../../../mock/mock-repository-factory';
import { RsuService } from '../../../../src/modules/node/service/rsu.service';
import { NotFoundException } from '@nestjs/common';

describe('RsuService', () => {
  let service: RsuService;
  let fakeRsuRepository: MockType<Repository<Rsu>>;
  const listRsu: Rsu[] = [
    {
      id: 1,
      name: 'RSU 1',
      cpu: 1,
      ram: 1,
      tx: 1,
      rx: 1,
      listObu: [],
      edge: new Edge(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'RSU 2',
      cpu: 1,
      ram: 1,
      tx: 1,
      rx: 1,
      listObu: [],
      edge: new Edge(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RsuService,
        {
          provide: getRepositoryToken(Rsu),
          useFactory: fakeRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<RsuService>(RsuService);
    fakeRsuRepository = module.get(getRepositoryToken(Rsu));
    fakeRsuRepository.findOne = jest.fn(
      ({ where }: { where: Partial<Rsu> }) => {
        const rsu = listRsu.filter((item) => {
          let condition = item.id > 0;
          if (where.id) {
            condition = condition && item.id === where.id;
          }
          if (where.name) {
            condition = condition && item.name === where.name;
          }
          return condition;
        });
        return rsu.length > 0 ? rsu[0] : null;
      },
    );
    fakeRsuRepository.save = jest.fn((rsu: Rsu) => rsu);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(fakeRsuRepository).toBeDefined();
  });

  it('findOne returns a rsu with given id', async () => {
    const expectedId = 1;
    const response = await service.findOne({ id: expectedId });
    expect(response).toBeDefined();
    expect(response.id).toEqual(expectedId);
  });

  it('findOne returns a rsu with given name', async () => {
    const expectedName = 'RSU 1';
    const response = await service.findOne({ name: expectedName });
    expect(response).toBeDefined();
    expect(response.name).toEqual(expectedName);
  });

  it('update returns an updated rsu', async () => {
    const attrs: Partial<Rsu> = { cpu: 100 };
    const expectedId = 1;
    const response = await service.update({ id: 1 }, attrs);
    expect(response).toBeDefined();
    expect(response.id).toEqual(expectedId);
    expect(response.cpu).toEqual(attrs.cpu);
  });

  it('update throw error', async () => {
    await expect(service.update({ id: 3 }, { cpu: 100 })).rejects.toThrow(
      NotFoundException,
    );
  });
});
