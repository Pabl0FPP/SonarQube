import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { QrService } from './qr.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from '../cloudinary/cloudinary.storage';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('qr')
@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post()
  @ApiOperation({ summary: 'Generate a QR code for a file and upload it to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to generate QR code for (the file path will be encoded in the QR)'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'QR code generated and uploaded successfully.', schema: { example: { qrUrl: 'https://res.cloudinary.com/.../qrcode.png' } } })
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() filename: string,
  ) {
    
    const fileUrl = file.path;
    filename = fileUrl;

    return await this.qrService.create(filename);
  }
}