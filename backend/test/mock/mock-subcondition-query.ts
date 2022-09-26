export const mockSubconditionQuery = {
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  whereInIds: jest.fn().mockReturnThis(),
  andWhereInIds: jest.fn().mockReturnThis(),
  orWhereInIds: jest.fn().mockReturnThis(),
};
