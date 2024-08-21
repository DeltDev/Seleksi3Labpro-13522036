import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  DeleteObjectCommandInput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class S3Service {
  private region: string;
  private s3Client: S3Client;
  constructor(private configService: ConfigService) {
    this.region = configService.get<string>('S3_REGION') || 'ap-southeast-2';
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      }
    });
  }
  async uploadFile(file: Express.Multer.File, key: string): Promise<any> {
    const bucket = this.configService.get<string>('S3_BUCKET') || '';
    const input: PutObjectCommandInput ={
      Body: file.buffer,
      Bucket: bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }
    try{
      const response: PutObjectCommandOutput = await this.s3Client.send(new PutObjectCommand(input));
      if(response.$metadata.httpStatusCode === 200){
        return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
      throw new Error('Upload to S3 failed');
    } catch(error){
      return {
        status: 'error',
        message: `File upload failed: ${error.message}`,
        data: null,
      };
    }
  }
  async deleteFile(key: string): Promise<void> {
    const bucket = this.configService.get<string>('S3_BUCKET') || '';
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      throw new Error(`Failed to delete file from S3: ${error.message}`);
    }
  }
}
