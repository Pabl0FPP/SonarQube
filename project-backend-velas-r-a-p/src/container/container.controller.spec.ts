import { Test, TestingModule } from '@nestjs/testing';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt'; // Importar JwtService

describe('ContainerController', () => {
  let controller: ContainerController;
  let service: ContainerService;

  const mockContainerService = {
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
      controllers: [ContainerController],
      providers: [
        {
          provide: ContainerService,
          useValue: mockContainerService,
        },
        {
          provide: JwtService, // Proveer el mock del JwtService
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: jest.fn(() => true), // Mock del AuthGuard para permitir acceso
      })
      .compile();

    controller = module.get<ContainerController>(ContainerController);
    service = module.get<ContainerService>(ContainerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a container', async () => {
      const dto: CreateContainerDto = { name: 'Glass Jar', material: 'Glass', diameter: 10, height: 15 };
      mockContainerService.create.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.create(dto);

      expect(result).toEqual({ id: '1', ...dto });
      expect(mockContainerService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all containers', async () => {
      const containers = [{ id: '1', name: 'Glass Jar', material: 'Glass', diameter: 10, height: 15 }];
      mockContainerService.findAll.mockResolvedValue(containers);

      const result = await controller.findAll();

      expect(result).toEqual(containers);
      expect(mockContainerService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a container by ID', async () => {
      const container = { id: '1', name: 'Glass Jar', material: 'Glass', diameter: 10, height: 15 };
      mockContainerService.findOne.mockResolvedValue(container);

      const result = await controller.findOne('1');

      expect(result).toEqual(container);
      expect(mockContainerService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if container is not found', async () => {
      mockContainerService.findOne.mockRejectedValue(new NotFoundException('Container not found'));

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
      expect(mockContainerService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a container', async () => {
      const dto: UpdateContainerDto = {
        name: 'Updated Glass Jar',
        material: 'Glass',
        diameter: 12,
        height: 18,
      };
      const updatedContainer = {
        id: '1',
        name: 'Updated Glass Jar',
        material: 'Glass',
        diameter: 12,
        height: 18,
      };
      mockContainerService.update.mockResolvedValue(updatedContainer);

      const result = await controller.update('1', dto);

      expect(result).toEqual(updatedContainer);
      expect(mockContainerService.update).toHaveBeenCalledWith('1', dto);
    });

    it('should throw NotFoundException if container to update is not found', async () => {
      const dto: UpdateContainerDto = {
        name: 'Updated Glass Jar',
        material: 'Glass',
        diameter: 12,
        height: 18,
      };
      mockContainerService.update.mockRejectedValue(new NotFoundException('Container not found'));

      await expect(controller.update('1', dto)).rejects.toThrow(NotFoundException);
      expect(mockContainerService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a container', async () => {
      mockContainerService.remove.mockResolvedValue({ id: '1' });

      const result = await controller.remove('1');

      expect(result).toEqual({ id: '1' });
      expect(mockContainerService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if container to remove is not found', async () => {
      mockContainerService.remove.mockRejectedValue(new NotFoundException('Container not found'));

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
      expect(mockContainerService.remove).toHaveBeenCalledWith('1');
    });
  });
});