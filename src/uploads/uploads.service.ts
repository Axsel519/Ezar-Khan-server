import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

@Injectable()
export class UploadsService {
  private gridFSBucket: GridFSBucket;

  constructor(@InjectConnection() private connection: Connection) {
    const db = this.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    this.gridFSBucket = new GridFSBucket(db, {
      bucketName: 'uploads',
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ id: string; url: string; filename: string }> {
    const readableStream = Readable.from(file.buffer);

    const uploadStream = this.gridFSBucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
        size: file.size,
        uploadDate: new Date(),
      },
    });

    return new Promise((resolve, reject) => {
      readableStream
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => {
          const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
          resolve({
            id: uploadStream.id.toString(),
            url: `${baseUrl}/uploads/${uploadStream.id.toString()}`,
            filename: file.originalname,
          });
        });
    });
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
  ): Promise<Array<{ id: string; url: string; filename: string }>> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async getImage(id: string): Promise<{
    stream: any;
    contentType: string;
    filename: string;
  }> {
    try {
      const _id = new ObjectId(id);

      // Get file info
      const files = await this.gridFSBucket.find({ _id }).toArray();

      if (!files || files.length === 0) {
        throw new NotFoundException('Image not found');
      }

      const file = files[0];
      const downloadStream = this.gridFSBucket.openDownloadStream(_id);

      return {
        stream: downloadStream,
        contentType: file.contentType || 'image/jpeg',
        filename: file.filename,
      };
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      const _id = new ObjectId(id);
      await this.gridFSBucket.delete(_id);
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }

  async deleteMultipleImages(ids: string[]): Promise<void> {
    const deletePromises = ids.map((id) => this.deleteImage(id));
    await Promise.all(deletePromises);
  }

  async getAllImages(): Promise<
    Array<{ id: string; filename: string; size: number; uploadDate: Date }>
  > {
    const files = await this.gridFSBucket.find().toArray();

    return files.map((file) => ({
      id: file._id.toString(),
      filename: file.filename,
      size: file.length,
      uploadDate: file.uploadDate,
    }));
  }
}
