import { Test, TestingModule } from '@nestjs/testing';
import { ContributeService } from './contribute.service';

describe('ContributeService', () => {
  let service: ContributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContributeService],
    }).compile();

    service = module.get<ContributeService>(ContributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
