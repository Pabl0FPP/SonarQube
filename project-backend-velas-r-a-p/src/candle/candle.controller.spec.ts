import { Test, TestingModule } from '@nestjs/testing';
import { CandleController } from './candle.controller';
import { CandleService } from './candle.service';
import { CreateCandleDto } from './dto/create-candle.dto';

describe('CandleController', () => {
  let controller: CandleController;
  let service: CandleService;

  const mockCandleService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandleController],
      providers: [
        {
          provide: CandleService,
          useValue: mockCandleService,
        },
      ],
    }).compile();

    controller = module.get<CandleController>(CandleController);
    service = module.get<CandleService>(CandleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
  it('should call CandleService.create with the correct data', async () => {
    const createDto: CreateCandleDto = {
      message: 'A relaxing candle',
      image: 'https://example.com/image.jpg',
      price: 19.99,
      fraganceId: 'fragance-id',
      containerId: 'container-id',
    };
    const createdCandle = { id: 'candle-id', ...createDto };

    mockCandleService.create.mockResolvedValue(createdCandle);

    const result = await controller.create(createDto);

    expect(result).toEqual(createdCandle);
    expect(mockCandleService.create).toHaveBeenCalledWith(createDto);
  });
});

  describe('findOne', () => {
    it('should call CandleService.findOne with the correct ID', async () => {
      const candleId = 'candle-id';
      const candle = {
        id: candleId,
        name: 'Vanilla Candle',
        fraganceId: 'fragance-id',
        price: 19.99,
      };

      mockCandleService.findOne.mockResolvedValue(candle);

      const result = await controller.findOne(candleId);

      expect(result).toEqual(candle);
      expect(mockCandleService.findOne).toHaveBeenCalledWith(candleId);
    });
  });
});