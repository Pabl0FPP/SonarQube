import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: bcrypt.hashSync('Password123!', 10),
};

const mockUsersService = {
  findByEmail: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockToken'),
};

const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository }, 
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      jest.spyOn(mockUsersService, 'findByEmail').mockResolvedValueOnce(null); 
  
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };
  
      const result = await service.register(registerDto);
  
      expect(result).toEqual({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(mockUsersService.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: expect.any(String),
      });
    });
  
    it('should throw BadRequestException if email is already registered', async () => {
      jest.spyOn(mockUsersService, 'findByEmail').mockResolvedValueOnce(mockUser);
  
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };
  
      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });
  
  describe('login', () => {
    it('should login a user and return a token', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        password: bcrypt.hashSync('Password123!', 10),
        roles: ['USER'],
      }); 
  
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true); 
  
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
  
      const result = await service.login(loginDto);
  
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        roles: ['USER'], 
        token: 'mockToken',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: '1', roles: ['USER'] }); // Verifica que se generó el token
    });
  
    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword!',
      };
  
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        password: bcrypt.hashSync('Password123!', 10), 
        roles: ['USER'],
      }); // Simula que el usuario existe
  
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false); // Simula que la contraseña es inválida
  
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});