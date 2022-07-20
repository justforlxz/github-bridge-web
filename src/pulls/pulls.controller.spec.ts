import { Test, TestingModule } from '@nestjs/testing';
import { PullsController } from './pulls.controller';

describe('PullsController', () => {
  let controller: PullsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PullsController],
    }).compile();

    controller = module.get<PullsController>(PullsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
