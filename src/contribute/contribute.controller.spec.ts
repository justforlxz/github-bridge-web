import { Test, TestingModule } from '@nestjs/testing';
import { ContributeController } from './contribute.controller';

describe('ContributeController', () => {
  let controller: ContributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributeController],
    }).compile();

    controller = module.get<ContributeController>(ContributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
