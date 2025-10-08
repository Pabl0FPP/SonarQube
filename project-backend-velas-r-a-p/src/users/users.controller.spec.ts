import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users (happy path)', async () => {
      const users = [
        { id: 'user-id-1', name: 'John Doe', email: 'john@example.com' },
        { id: 'user-id-2', name: 'Jane Doe', email: 'jane@example.com' },
      ];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID (happy path)', async () => {
      const user = { id: 'user-id', name: 'John Doe', email: 'john@example.com' };
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('user-id');

      expect(result).toEqual(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundException if user is not found (non-happy path)', async () => {
      mockUsersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
  it('should update a user by ID (happy path)', async () => {
    const updateDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
      password: 'new-password', // Agregada la propiedad password
    };
    const updatedUser = { id: 'user-id', ...updateDto };

    mockUsersService.update.mockResolvedValue(updatedUser);

    const result = await controller.update('user-id', updateDto);

    expect(result).toEqual(updatedUser);
    expect(mockUsersService.update).toHaveBeenCalledWith('user-id', updateDto);
  });

  it('should throw NotFoundException if user is not found (non-happy path)', async () => {
    const updateDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
      password: 'new-password', 
    };

    mockUsersService.update.mockRejectedValue(new NotFoundException());

    await expect(controller.update('invalid-id', updateDto)).rejects.toThrow(NotFoundException);
    expect(mockUsersService.update).toHaveBeenCalledWith('invalid-id', updateDto);
  });
});

  describe('remove', () => {
    it('should remove a user by ID (happy path)', async () => {
      mockUsersService.remove.mockResolvedValue({ deleted: true });

      const result = await controller.remove('user-id');

      expect(result).toEqual({ deleted: true });
      expect(mockUsersService.remove).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundException if user is not found (non-happy path)', async () => {
      mockUsersService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('invalid-id')).rejects.toThrow(NotFoundException);
      expect(mockUsersService.remove).toHaveBeenCalledWith('invalid-id');
    });
  });
});