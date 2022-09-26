import { Repository } from 'typeorm';
import { MockType } from './mock-type';

export const fakeRepositoryFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValueOnce([]),
      getRawMany: jest
        .fn()
        .mockReturnValueOnce(Array.from({ length: 10 }, () => {})),
      getCount: jest.fn().mockReturnValueOnce(10),
    })),
  }),
);
