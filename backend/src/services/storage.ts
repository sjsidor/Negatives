import { Storage } from '@google-cloud/storage';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

class StorageService {
  private storage: Storage;
  private bucket: string;
  private cacheDir: string;

  constructor() {
    this.storage = new Storage();
    this.bucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || '';
    this.cacheDir = path.join(__dirname, '../../cache');
    
    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucket);
    const gcsFileName = `${Date.now()}-${file.originalname}`;
    const blob = bucket.file(gcsFileName);

    // For HEIC files, convert to JPEG before uploading
    if (file.originalname.toLowerCase().endsWith('.heic')) {
      const inputBuffer = await readFile(file.path);
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.9
      });

      // Save converted file temporarily
      const jpegPath = file.path + '.jpg';
      await writeFile(jpegPath, outputBuffer);

      // Upload converted file
      await bucket.upload(jpegPath, {
        destination: gcsFileName.replace(/\.heic$/i, '.jpg'),
        metadata: {
          contentType: 'image/jpeg',
        },
      });

      // Clean up temporary files
      await unlink(jpegPath);
      await unlink(file.path);

      return gcsFileName.replace(/\.heic$/i, '.jpg');
    }

    // For TIFF files, convert to JPEG before uploading
    if (file.originalname.toLowerCase().endsWith('.tif') || file.originalname.toLowerCase().endsWith('.tiff')) {
      const jpegPath = file.path + '.jpg';
      await sharp(file.path)
        .jpeg({ quality: 90 })
        .toFile(jpegPath);

      // Upload converted file
      await bucket.upload(jpegPath, {
        destination: gcsFileName.replace(/\.(tif|tiff)$/i, '.jpg'),
        metadata: {
          contentType: 'image/jpeg',
        },
      });

      // Clean up temporary files
      await unlink(jpegPath);
      await unlink(file.path);

      return gcsFileName.replace(/\.(tif|tiff)$/i, '.jpg');
    }

    // For other image types, upload directly
    await bucket.upload(file.path, {
      destination: gcsFileName,
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Clean up temporary file
    await unlink(file.path);

    return gcsFileName;
  }

  async getSignedUrl(fileName: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucket);
    const file = bucket.file(fileName);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    return url;
  }

  async deleteFile(fileName: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucket);
    const file = bucket.file(fileName);
    await file.delete();
  }
}

export const storageService = new StorageService(); 