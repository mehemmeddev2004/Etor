import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  /**
   * Handle single file upload
   */
  async uploadSingleFile(file: Express.Multer.File): Promise<{ url: string; filename: string; size: number }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    return {
      url: `/uploads/${filename}`,
      filename: filename,
      size: file.size
    };
  }

  /**
   * Handle multiple files upload
   */
  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<Array<{ url: string; filename: string; size: number }>> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedFiles: Array<{ url: string; filename: string; size: number }> = [];
    
    for (const file of files) {
      const result = await this.uploadSingleFile(file);
      uploadedFiles.push(result);
    }

    return uploadedFiles;
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(filename: string): Promise<{ success: boolean; message: string }> {
    try {
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { success: true, message: 'File deleted successfully' };
      } else {
        return { success: false, message: 'File not found' };
      }
    } catch (error) {
      throw new BadRequestException('Error deleting file');
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(filename: string): Promise<{ exists: boolean; size?: number; path?: string }> {
    try {
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          exists: true,
          size: stats.size,
          path: `/uploads/${filename}`
        };
      } else {
        return { exists: false };
      }
    } catch (error) {
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
