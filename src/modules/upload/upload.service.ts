import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../../libs/cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService
  ) {}

  /**
   * Handle single file upload
   */
  async uploadSingleFile(file: Express.Multer.File): Promise<{ url: string; filename: string; size: number; publicId: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    try {
      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadImage(file, 'uploads');
      
      if (!result || !result.secure_url) {
        throw new InternalServerErrorException('Failed to upload file to cloud storage');
      }

      return {
        url: result.secure_url,
        filename: result.public_id,
        size: file.size,
        publicId: result.public_id
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * Handle multiple files upload
   */
  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<Array<{ url: string; filename: string; size: number; publicId: string }>> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    try {
      const uploadPromises = files.map(file => this.uploadSingleFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw new InternalServerErrorException('Failed to upload files');
    }
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(publicId: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.cloudinaryService.deleteImage(publicId);
      
      if (result.result === 'ok') {
        return { success: true, message: 'File deleted successfully' };
      } else {
        return { success: false, message: 'File not found or could not be deleted' };
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw new BadRequestException('Error deleting file');
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(publicId: string): Promise<{ exists: boolean; size?: number; url?: string }> {
    try {
      const result = await this.cloudinaryService.getImageDetails(publicId);
      
      if (result) {
        return {
          exists: true,
          size: result.bytes,
          url: result.secure_url
        };
      } else {
        return { exists: false };
      }
    } catch (error) {
      console.error('Get file info error:', error);
      return { exists: false };
    }
  }

  /**
   * Validate file type
   */
  validateFileType(file: Express.Multer.File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.mimetype);
  }

  /**
   * Get allowed image types
   */
  getAllowedImageTypes(): string[] {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  }

  /**
   * Get allowed document types
   */
  getAllowedDocumentTypes(): string[] {
    return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  }
}
