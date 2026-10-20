import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    url: string;
    publicId: string;
  }> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    return new Promise((resolve, reject) => {
      let settled = false;

      const finish = (
        error?: Error,
        result?: { url: string; publicId: string },
      ) => {
        if (settled) return;

        settled = true;
        clearTimeout(timeout);

        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(
            new InternalServerErrorException(
              'Cloudinary did not return an upload result',
            ),
          );
          return;
        }

        resolve(result);
      };

      const timeout = setTimeout(() => {
        console.error(`Cloudinary upload timed out: ${file.originalname}`);

        finish(
          new InternalServerErrorException(
            'Image upload timed out. Please try again.',
          ),
        );
      }, 60_000);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload failed:', error);

            finish(
              new InternalServerErrorException(
                'Failed to upload image to Cloudinary',
              ),
            );
            return;
          }

          if (!result) {
            finish(
              new InternalServerErrorException(
                'Cloudinary did not return an upload result',
              ),
            );
            return;
          }

          finish(undefined, {
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      uploadStream.on('error', (error: Error) => {
        console.error('Cloudinary upload stream error:', error);

        finish(new InternalServerErrorException('Image upload stream failed'));
      });

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
    } catch (error) {
      console.error('Cloudinary image deletion failed:', error);

      throw new InternalServerErrorException(
        'Failed to delete image from Cloudinary',
      );
    }
  }
}
