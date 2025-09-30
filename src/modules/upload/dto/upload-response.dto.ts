import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ description: 'File URL' })
  url: string;

  @ApiProperty({ description: 'File name' })
  filename: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;
}

export class MultipleUploadResponseDto {
  @ApiProperty({ type: [UploadResponseDto], description: 'Array of uploaded files' })
  files: UploadResponseDto[];
}

export class DeleteFileResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;
}

export class FileInfoResponseDto {
  @ApiProperty({ description: 'File exists status' })
  exists: boolean;

  @ApiProperty({ description: 'File size in bytes', required: false })
  size?: number;

  @ApiProperty({ description: 'File path', required: false })
  path?: string;
}
