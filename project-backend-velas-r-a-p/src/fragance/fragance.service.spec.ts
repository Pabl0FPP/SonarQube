import { Test, TestingModule } from '@nestjs/testing';
import { FraganceService } from './fragance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fragance } from './entities/fragance.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('FraganceService', () => {
  let service: FraganceService;
  let repository: Repository<Fragance>;

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FraganceService,
        {
          provide: getRepositoryToken(Fragance),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FraganceService>(FraganceService);
    repository = module.get<Repository<Fragance>>(getRepositoryToken(Fragance));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new fragance', async () => {
      const createDto = {
        name: 'Vanilla Dream',
        topNotes: 'Vanilla, Citrus',
        middleNotes: 'Jasmine, Rose',
        baseNotes: 'Sandalwood, Musk',
        image: 'https://example.com/image.jpg',
      };
      const savedFragance = { id: 'fragance-id', ...createDto, candles: [] };

      mockRepository.save.mockResolvedValue(savedFragance);

      const result = await service.create(createDto);

      expect(result).toEqual(savedFragance);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all fragances', async () => {
      const fragances = [
        {
          id: 'fragance-id-1',
          name: 'Vanilla Dream',
          topNotes: 'Vanilla, Citrus',
          middleNotes: 'Jasmine, Rose',
          baseNotes: 'Sandalwood, Musk',
          image: 'https://example.com/image1.jpg',
          candles: [],
        },
        {
          id: 'fragance-id-2',
          name: 'Citrus Bliss',
          topNotes: 'Citrus, Lemon',
          middleNotes: 'Orange Blossom',
          baseNotes: 'Amber, Musk',
          image: 'https://example.com/image2.jpg',
          candles: [],
        },
      ];

      mockRepository.find.mockResolvedValue(fragances);

      const result = await service.findAll();

      expect(result).toEqual(fragances);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a fragance by ID', async () => {
      const fragance = {
        id: 'fragance-id',
        name: 'Vanilla Dream',
        topNotes: 'Vanilla, Citrus',
        middleNotes: 'Jasmine, Rose',
        baseNotes: 'Sandalwood, Musk',
        image: 'https://example.com/image.jpg',
        candles: [],
      };

      mockRepository.findOneBy.mockResolvedValue(fragance);

      const result = await service.findOne('fragance-id');

      expect(result).toEqual(fragance);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 'fragance-id' });
    });

    it('should throw NotFoundException if fragance is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 'invalid-id' });
    });
  });

  describe('update', () => {
    it('should update a fragance by ID', async () => {
      const updateDto = {
        name: 'Updated Name',
        topNotes: 'Updated Top Notes', // Cambiado a topNotes
        middleNotes: 'Updated Middle Notes', // Cambiado a middleNotes
        baseNotes: 'Updated Base Notes', // Cambiado a baseNotes
        image: 'https://example.com/updated-image.jpg',
      };
      const updatedFragance = { id: 'fragance-id', ...updateDto, candles: [] };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedFragance);

      const result = await service.update('fragance-id', updateDto);

      expect(result).toEqual(updatedFragance);
      expect(mockRepository.update).toHaveBeenCalledWith('fragance-id', updateDto);
      expect(service.findOne).toHaveBeenCalledWith('fragance-id');
    });

    it('should throw NotFoundException if fragance is not found', async () => {
      const updateDto = {
        name: 'Updated Name',
        topNotes: 'Updated Top Notes', // Cambiado a topNotes
        middleNotes: 'Updated Middle Notes', // Cambiado a middleNotes
        baseNotes: 'Updated Base Notes', // Cambiado a baseNotes
        image: 'https://example.com/updated-image.jpg',
      };

      mockRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.update).toHaveBeenCalledWith('invalid-id', updateDto);
    });
});

  describe('remove', () => {
    it('should remove a fragance by ID', async () => {
      const fragance = {
        id: 'fragance-id',
        name: 'Vanilla Dream',
        topNotes: 'Vanilla, Citrus', // Cambiado a top_notes
        middleNotes: 'Jasmine, Rose', // Cambiado a middle_notes
        baseNotes: 'Sandalwood, Musk', // Cambiado a base_notes
        image: 'https://example.com/image.jpg',
        candles: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(fragance);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('fragance-id');

      expect(result).toEqual(fragance);
      expect(service.findOne).toHaveBeenCalledWith('fragance-id');
      expect(mockRepository.delete).toHaveBeenCalledWith('fragance-id');
    });

    it('should throw NotFoundException if fragance is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
});
});