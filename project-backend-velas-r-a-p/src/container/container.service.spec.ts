import { Test, TestingModule } from '@nestjs/testing';
import { ContainerService } from './container.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container } from './entities/container.entity';
import { NotFoundException } from '@nestjs/common';
import { generate } from 'rxjs';

const mockContainer = {
  id: '1',
  name: 'Glass Jar',
  material: 'Glass',
  diameter: 10,
  height: 15,
  image: 'glass_jar.jpg',
  candles: [],
};

const mockRepository = {
  find: jest.fn().mockResolvedValue([mockContainer]),
  findOneBy: jest.fn().mockResolvedValue(mockContainer),
  save: jest.fn().mockResolvedValue(mockContainer),
  update: jest.fn().mockResolvedValue({ affected: 1, raw:{}, generatedMaps:[] }),
  delete: jest.fn().mockResolvedValue({ affected: 1}),
};

describe('ContainerService', () => {
  let service: ContainerService;
  let repository: Repository<Container>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContainerService,
        {
          provide: getRepositoryToken(Container),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContainerService>(ContainerService);
    repository = module.get<Repository<Container>>(getRepositoryToken(Container));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of containers', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockContainer]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a container by ID', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockContainer);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException if container is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new container', async () => {
      const result = await service.create(mockContainer);
      expect(result).toEqual(mockContainer);
      expect(repository.save).toHaveBeenCalledWith(mockContainer);
    });
  });

  describe('update', () => {
    it('should update a container', async () => {
      jest.spyOn(repository, 'update').mockResolvedValueOnce({ affected: 1, raw: {}, generatedMaps: [] }); 
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(mockContainer); 

      const result = await service.update('1', mockContainer);
      expect(result).toEqual(mockContainer); 
      expect(repository.update).toHaveBeenCalledWith('1', mockContainer); 
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' }); 
    });

    it('should throw NotFoundException if container is not found', async () => {
      jest.spyOn(repository, 'update').mockResolvedValueOnce({ affected: 0, raw: {}, generatedMaps: [] }); 

      await expect(service.update('2', mockContainer)).rejects.toThrow(NotFoundException); 
      expect(repository.update).toHaveBeenCalledWith('2', mockContainer); 
    });
  });

  describe('remove', () => {
    it('should remove a container', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(mockContainer); 
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: 1, raw: {} }); 

      const result = await service.remove('1');
      expect(result).toEqual(mockContainer); 
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' }); 
      expect(repository.delete).toHaveBeenCalledWith('1'); 
    });
  });
});