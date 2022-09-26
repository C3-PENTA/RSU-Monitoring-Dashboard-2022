import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmConfigService } from '../../../src/config/database/typeorm-config.service';

describe('TypeOrmConfigService', () => {
  let service: TypeOrmConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeOrmConfigService, ConfigService],
    }).compile();

    service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns an array', () => {
    const typeOrmOption = service.createTypeOrmOptions();
    expect(typeOrmOption).toBeDefined();
  });
});
