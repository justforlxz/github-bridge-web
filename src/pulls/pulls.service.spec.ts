import { Test, TestingModule } from '@nestjs/testing';
import { PullsService } from './pulls.service';

describe('PullsService', () => {
  let service: PullsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PullsService],
    }).compile();

    service = module.get<PullsService>(PullsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
