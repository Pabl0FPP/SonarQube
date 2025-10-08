import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      token: 'mockToken',
    }),
    register: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    }),
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ id: '1', roles: ['USER'] }), 
    decode: jest.fn().mockReturnValue({ id: '1', roles: ['USER'] }), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService, 
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a user with a token', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        token: 'mockToken',
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should return the registered user', async () => {
      const registerDto: RegisterUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getMe', () => {
    it('should return a message for the authenticated user', () => {
      const result = controller.getMe();
      expect(result).toEqual({ message: 'Hello from me!' });
    });
  });
});