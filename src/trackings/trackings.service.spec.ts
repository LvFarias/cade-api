import { Test, TestingModule } from '@nestjs/testing';
import { TrackingsService } from './trackings.service.js';

describe('TrackingsService', () => {
  let service: TrackingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackingsService],
    }).compile();

    service = module.get<TrackingsService>(TrackingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
