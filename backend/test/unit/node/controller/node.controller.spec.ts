import { Test, TestingModule } from '@nestjs/testing';
import { NodeController } from '../../../../src/modules/node/controller/node.controller';
import { EdgeService } from '../../../../src/modules/node/service/edge.service';

describe('NodeController', () => {
  let controller: NodeController;
  let fakeEdgeService: Partial<EdgeService>;

  beforeEach(async () => {
    fakeEdgeService = {
      findAll: () => {
        return Promise.resolve({ listEdge: [] });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodeController],
      providers: [
        {
          provide: EdgeService,
          useValue: fakeEdgeService,
        },
      ],
    }).compile();

    controller = module.get<NodeController>(NodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllNodes returns an array', async () => {
    const nodes = await controller.getAllNodes();
    expect(nodes.listEdge).toEqual([]);
    expect(nodes.listEdge.length).toEqual(0);
  });
});
