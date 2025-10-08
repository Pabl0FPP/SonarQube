import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { cloudinary } from '../cloudinary/cloudinary.config';

@Injectable()
export class QrService {
  /**
   * Generates a QR code from the given filename (URL or string), uploads it to Cloudinary, and returns the URL.
   * @param filename The string to encode in the QR code (usually a file URL).
   * @returns An object with the Cloudinary URL of the generated QR code.
   * @throws Error if no filename is provided or upload fails.
   */
  async create(filename: string) {

    if (!filename) {
      throw new Error('No file provided to generate QR code');
    }

    const qrBuffer = await QRCode.toBuffer(filename)

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'files' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(qrBuffer);
    });
    return { qrUrl: (uploadResult as any).secure_url}

  }
}