import { Test, TestingModule } from '@nestjs/testing';
import { FraganceController } from './fragance.controller';
import { FraganceService } from './fragance.service';
import { CreateFraganceDto } from './dto/create-fragance.dto';
import { UpdateFraganceDto } from './dto/update-fragance.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt'; // Importar JwtService

describe('FraganceController', () => {
  let controller: FraganceController;
  let service: FraganceService;

  const mockFraganceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mocked-jwt-token'),
    verify: jest.fn(() => ({ userId: 'mocked-user-id' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FraganceController],
      providers: [
        {
          provide: FraganceService,
          useValue: mockFraganceService,
        },
        {
          provide: JwtService, // Proveer el mock del JwtService
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn(() => true), // Mock completo del AuthGuard
      })
      .compile();

    controller = module.get<FraganceController>(FraganceController);
    service = module.get<FraganceService>(FraganceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new fragance', async () => {
      const createDto: CreateFraganceDto = {
        name: 'Vanilla Dream',
        topNotes: 'Vanilla, Citrus',
        middleNotes: 'Jasmine, Rose',
        baseNotes: 'Sandalwood, Musk',
        image: 'https://example.com/image.jpg',
      };
      const createdFragance = { id: 'fragance-id', ...createDto };

      mockFraganceService.create.mockResolvedValue(createdFragance);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdFragance);
      expect(mockFraganceService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all fragances', async () => {
      const fragances = [
        { id: 'fragance-id-1', name: 'Vanilla Dream' },
        { id: 'fragance-id-2', name: 'Citrus Bliss' },
      ];

      mockFraganceService.findAll.mockResolvedValue(fragances);

      const result = await controller.findAll();

      expect(result).toEqual(fragances);
      expect(mockFraganceService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a fragance by ID', async () => {
      const fragance = { id: 'fragance-id', name: 'Vanilla Dream' };

      mockFraganceService.findOne.mockResolvedValue(fragance);

      const result = await controller.findOne('fragance-id');

      expect(result).toEqual(fragance);
      expect(mockFraganceService.findOne).toHaveBeenCalledWith('fragance-id');
    });

    it('should return null if fragance is not found', async () => {
      mockFraganceService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('invalid-id');

      expect(result).toBeNull();
      expect(mockFraganceService.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    it('should update a fragance by ID', async () => {
      const updateDto: UpdateFraganceDto = {
        name: 'Updated Name',
        topNotes: 'Updated Top Notes',
        middleNotes: 'Updated Middle Notes',
        baseNotes: 'Updated Base Notes',
        image: 'https://example.com/updated-image.jpg',
      };
      const updatedFragance = { id: 'fragance-id', ...updateDto };

      mockFraganceService.update.mockResolvedValue(updatedFragance);

      const result = await controller.update('fragance-id', updateDto);

      expect(result).toEqual(updatedFragance);
      expect(mockFraganceService.update).toHaveBeenCalledWith('fragance-id', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a fragance by ID', async () => {
      const deletedFragance = { id: 'fragance-id', name: 'Vanilla Dream' };

      mockFraganceService.remove.mockResolvedValue(deletedFragance);

      const result = await controller.remove('fragance-id');

      expect(result).toEqual(deletedFragance);
      expect(mockFraganceService.remove).toHaveBeenCalledWith('fragance-id');
    });
  });
});