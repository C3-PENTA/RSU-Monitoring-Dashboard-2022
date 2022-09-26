import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from '../../../../src/modules/node/entity/edge.entity';
import { EdgeService } from '../../../../src/modules/node/service/edge.service';
import { MockType } from '../../../mock/mock-type';
import { fakeRepositoryFactory } from '../../../mock/mock-repository-factory';

describe('EdgeService', () => {
  let service: EdgeService;
  let fakeEdgeRepository: MockType<Repository<Edge>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgeService,
        {
          provide: getRepositoryToken(Edge),
          useFactory: fakeRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<EdgeService>(EdgeService);
    fakeEdgeRepository = module.get(getRepositoryToken(Edge));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(fakeEdgeRepository).toBeDefined();
  });

  it('findAll returns an array', async () => {
    const edge: Edge = {
      id: 1,
      name: 'Edge 1',
      listRsu: [],
      createdAt: new Date('2020-01-01T00:00:00.000Z'),
      updatedAt: new Date('2020-01-01T00:00:00.000Z'),
    };
    fakeEdgeRepository.createQueryBuilder = jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockReturnValueOnce(Array.from({ length: 1 }, () => edge)),
    }));
    const response = await service.findAll();
    expect(response.listEdge.length).toEqual(1);
    expect(response.listEdge[0].id).toEqual(1);
  });
});
