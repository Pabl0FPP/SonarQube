import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../common/role.enum';
import { Cart } from '../cart/entities/cart.entity';
import { mock } from 'node:test';


const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  roles: [Role.USER],
  createdAt: new Date(),
  updatedAt: new Date(),
  cart: undefined,
  orders: [],
};

const mockRepository = {
  find: jest.fn().mockResolvedValue([mockUser]),
  findOneBy: jest.fn().mockResolvedValue(mockUser),
  save: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const result = await service.create(mockUser);
      expect(result).toEqual(mockUser);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const result = await service.update('1', mockUser);
      expect(result).toEqual(mockUser);
      expect(repository.update).toHaveBeenCalledWith('1', mockUser);
    });
  
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'update').mockResolvedValueOnce({ affected: 0, raw: {}, generatedMaps: [] });
      await expect(service.update('2', mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(mockUser); // Mock para findOne
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: 1, raw: {} }); // Mock para delete
  
      const result = await service.remove('1');
      expect(result).toEqual(mockUser);
      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null); // Mock para findOne que no encuentra el usuario
      await expect(service.remove('2')).rejects.toThrow(NotFoundException);
    });
  });
});