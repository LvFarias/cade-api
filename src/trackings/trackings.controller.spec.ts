import { Test, TestingModule } from '@nestjs/testing';
import { TrackingsController } from './trackings.controller.js';

describe('TrackingsController', () => {
  let controller: TrackingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingsController],
    }).compile();

    controller = module.get<TrackingsController>(TrackingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
