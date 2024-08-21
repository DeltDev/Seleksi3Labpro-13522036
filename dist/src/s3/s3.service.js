"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.region = configService.get('S3_REGION') || 'ap-southeast-2';
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            }
        });
    }
    async uploadFile(file, key) {
        const bucket = this.configService.get('S3_BUCKET') || '';
        const input = {
            Body: file.buffer,
            Bucket: bucket,
            Key: key,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        try {
            const response = await this.s3Client.send(new client_s3_1.PutObjectCommand(input));
            if (response.$metadata.httpStatusCode === 200) {
                return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
            }
            throw new Error('Upload to S3 failed');
        }
        catch (error) {
            return {
                status: 'error',
                message: `File upload failed: ${error.message}`,
                data: null,
            };
        }
    }
    async deleteFile(key) {
        const bucket = this.configService.get('S3_BUCKET') || '';
        const deleteParams = {
            Bucket: bucket,
            Key: key,
        };
        try {
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        }
        catch (error) {
            throw new Error(`Failed to delete file from S3: ${error.message}`);
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map