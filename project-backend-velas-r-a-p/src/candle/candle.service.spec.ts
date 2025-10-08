import { Test, TestingModule } from '@nestjs/testing';
import { CandleService } from './candle.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Candle } from './entities/candle.entity';
import { FraganceService } from '../fragance/fragance.service';
import { ContainerService } from '../container/container.service';
import { NotFoundException } from '@nestjs/common';

describe('CandleService', () => {
  let service: CandleService;
  let candleRepository: Repository<Candle>;
  let fraganceService: FraganceService;
  let containerService: ContainerService;

  const mockCandleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockFraganceService = {
    findOne: jest.fn(),
  };

  const mockContainerService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandleService,
        {
          provide: getRepositoryToken(Candle),
          useValue: mockCandleRepository,
        },
        {
          provide: FraganceService,
          useValue: mockFraganceService,
        },
        {
          provide: ContainerService,
          useValue: mockContainerService,
        },
      ],
    }).compile();

    service = module.get<CandleService>(CandleService);
    candleRepository = module.get<Repository<Candle>>(getRepositoryToken(Candle));
    fraganceService = module.get<FraganceService>(FraganceService);
    containerService = module.get<ContainerService>(ContainerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new candle', async () => {
      const createDto = {
        message: 'A relaxing candle',
        image: 'https://example.com/image.jpg',
        price: 19.99,
        fraganceId: 'fragance-id',
        containerId: 'container-id',
      };

      const fragance = { id: 'fragance-id' };
      const container = { id: 'container-id' };
      const createdCandle = { id: 'candle-id', ...createDto };

      mockFraganceService.findOne.mockResolvedValue(fragance);
      mockContainerService.findOne.mockResolvedValue(container);
      mockCandleRepository.create.mockReturnValue(createdCandle);
      mockCandleRepository.save.mockResolvedValue(createdCandle);

      const result = await service.create(createDto);

      expect(result).toEqual(createdCandle);
      expect(mockFraganceService.findOne).toHaveBeenCalledWith('fragance-id');
      expect(mockContainerService.findOne).toHaveBeenCalledWith('container-id');
      expect(mockCandleRepository.create).toHaveBeenCalledWith({
        message: 'A relaxing candle',
        image: 'https://example.com/image.jpg',
        price: 19.99,
        fragance: { id: 'fragance-id' },
        container: { id: 'container-id' },
      });
      expect(mockCandleRepository.save).toHaveBeenCalledWith(createdCandle);
    });

    it('should throw NotFoundException if fragance or container is not found', async () => {
      const createDto = {
        message: 'A relaxing candle',
        image: 'https://example.com/image.jpg',
        price: 19.99,
        fraganceId: 'invalid-fragance-id',
        containerId: 'invalid-container-id',
      };

      mockFraganceService.findOne.mockResolvedValue(null);
      mockContainerService.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      expect(mockFraganceService.findOne).toHaveBeenCalledWith('invalid-fragance-id');
      expect(mockContainerService.findOne).toHaveBeenCalledWith('invalid-container-id');
    });
  });

  describe('findOne', () => {
    it('should return a candle by ID', async () => {
      const candleId = 'candle-id';
      const candle = {
        id: candleId,
        message: 'A relaxing candle',
        image: 'https://example.com/image.jpg',
        fragance: { id: 'fragance-id' },
        container: { id: 'container-id' },
      };

      mockCandleRepository.findOneBy.mockResolvedValue(candle);

      const result = await service.findOne(candleId);

      expect(result).toEqual(candle);
      expect(mockCandleRepository.findOneBy).toHaveBeenCalledWith({ id: candleId });
    });

    it('should throw NotFoundException if candle is not found', async () => {
      const candleId = 'invalid-candle-id';

      mockCandleRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(candleId)).rejects.toThrow(NotFoundException);
      expect(mockCandleRepository.findOneBy).toHaveBeenCalledWith({ id: candleId });
    });
  });
});