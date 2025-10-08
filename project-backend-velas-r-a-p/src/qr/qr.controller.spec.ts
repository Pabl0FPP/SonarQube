import { Test, TestingModule } from '@nestjs/testing';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';

describe('QrController', () => {
  let qrController: QrController;
  let qrService: any;

  const mockQrService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QrController],
      providers: [
        {
          provide: QrService,
          useValue: mockQrService,
        },
      ],
    }).compile();

    qrController = module.get<QrController>(QrController);
    qrService = module.get<QrService>(QrService);
  });

  it('should be defined', () => {
    expect(qrController).toBeDefined();
  });

  describe('create', () => {
    it('should call QrService.create with the correct filename', async () => {
      const mockFile = {
        path: 'https://res.cloudinary.com/demo/file.png',
      } as Express.Multer.File;
      const mockFilename = 'https://res.cloudinary.com/demo/file.png';
      const mockResponse = { qrUrl: 'https://res.cloudinary.com/demo/qrcode.png' };

      qrService.create.mockResolvedValue(mockResponse);

      const result = await qrController.create(mockFile, mockFilename);

      expect(qrService.create).toHaveBeenCalledWith(mockFilename);
      expect(result).toBe(mockResponse);
    });

    it('should throw an error if QrService.create fails', async () => {
      const mockFile = {
        path: 'https://res.cloudinary.com/demo/file.png',
      } as Express.Multer.File;
      const mockFilename = 'https://res.cloudinary.com/demo/file.png';

      qrService.create.mockRejectedValue(new Error('QR generation failed'));

      await expect(qrController.create(mockFile, mockFilename)).rejects.toThrow('QR generation failed');
    });
  });
});