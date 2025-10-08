import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test-secret' });
    guard = new AuthGuard(jwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access if token is valid', async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer valid-token' },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: '123' });

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should deny access if token is missing', async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should deny access if token is invalid', async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer invalid-token' },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should attach the payload to the request object if token is valid', async () => {
      const mockPayload = { userId: '123' };
      const mockRequest = {
        headers: { authorization: 'Bearer valid-token' },
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
      expect(mockRequest['user']).toEqual(mockPayload);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract the token from the Authorization header', () => {
      const mockRequest = {
        headers: { authorization: 'Bearer valid-token' },
      } as any;

      const token = guard['extractTokenFromHeader'](mockRequest);
      expect(token).toBe('valid-token');
    });

    it('should return undefined if Authorization header is missing', () => {
      const mockRequest = {
        headers: {},
      } as any;

      const token = guard['extractTokenFromHeader'](mockRequest);
      expect(token).toBeUndefined();
    });

    it('should return undefined if Authorization header is not a Bearer token', () => {
      const mockRequest = {
        headers: { authorization: 'Basic some-token' },
      } as any;

      const token = guard['extractTokenFromHeader'](mockRequest);
      expect(token).toBeUndefined();
    });
  });
});