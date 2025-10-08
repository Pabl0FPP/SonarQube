import { Test, TestingModule } from '@nestjs/testing';
import { QrService } from './qr.service';
import * as QRCode from 'qrcode';
import { cloudinary } from '../cloudinary/cloudinary.config';

jest.mock('qrcode');
jest.mock('../cloudinary/cloudinary.config', () => ({
  cloudinary: {
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

describe('QrService', () => {
  let qrService: QrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QrService],
    }).compile();

    qrService = module.get<QrService>(QrService);
  });

  it('should be defined', () => {
    expect(qrService).toBeDefined();
  });

  describe('create', () => {
    it('should generate a QR code and upload it to Cloudinary', async () => {
      const mockFilename = 'https://example.com/file.png';
      const mockQrBuffer = Buffer.from('mock-qr-code');
      const mockCloudinaryResponse = { secure_url: 'https://res.cloudinary.com/demo/qrcode.png' };

      (QRCode.toBuffer as jest.Mock).mockResolvedValue(mockQrBuffer);

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
        callback(null, mockCloudinaryResponse);
        return { end: jest.fn() };
      });

      const result = await qrService.create(mockFilename);

      expect(QRCode.toBuffer).toHaveBeenCalledWith(mockFilename);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
      expect(result).toEqual({ qrUrl: mockCloudinaryResponse.secure_url });
    });

    it('should throw an error if no filename is provided', async () => {
      await expect(qrService.create('')).rejects.toThrow('No file provided to generate QR code');
    });

    it('should throw an error if QRCode.toBuffer fails', async () => {
      const mockFilename = 'https://example.com/file.png';

      (QRCode.toBuffer as jest.Mock).mockRejectedValue(new Error('QR code generation failed'));

      await expect(qrService.create(mockFilename)).rejects.toThrow('QR code generation failed');
    });

    it('should throw an error if Cloudinary upload fails', async () => {
      const mockFilename = 'https://example.com/file.png';
      const mockQrBuffer = Buffer.from('mock-qr-code');

      (QRCode.toBuffer as jest.Mock).mockResolvedValue(mockQrBuffer);

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
        callback(new Error('Cloudinary upload failed'), null);
        return { end: jest.fn() };
      });

      await expect(qrService.create(mockFilename)).rejects.toThrow('Cloudinary upload failed');
    });
  });
});