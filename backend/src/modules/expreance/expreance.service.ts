import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CloudinaryService } from '../../helpers/cloudinary/cloudanry.service';

import { CreateExperienceDto, UpdateExperienceDto } from './dto/expreance.dto';

@Injectable()
export class ExperiencesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.prisma.experience.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,
        organization: true,
        role: true,
        responsibilities: true,
        learned: true,
        location: true,
        images: true,
        employmentType: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        experienceLetterUrl: true,
        sortOrder: true,
        isActive: true,
      },

      orderBy: [
        {
          isCurrent: 'desc',
        },
        {
          startDate: 'desc',
        },
        {
          sortOrder: 'asc',
        },
      ],
    });
  }

  async create(
    userId: string,
    createExperienceDto: CreateExperienceDto,
    images: Express.Multer.File[],
  ) {
    const { startDate, endDate, ...data } = createExperienceDto;

    /*
     * Upload all selected images to Cloudinary.
     */
    const uploadedImages = await Promise.all(
      images.map((image) =>
        this.cloudinaryService.uploadImage(image, 'experiences'),
      ),
    );

    const imageUrls = uploadedImages.map((image) => image.url);

    return this.prisma.experience.create({
      data: {
        ...data,

        images: imageUrls,

        startDate: new Date(startDate),

        endDate: endDate ? new Date(endDate) : null,

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return experience;
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
    images: Express.Multer.File[],
  ) {
    /*
     * Get existing experience first.
     */
    const existingExperience = await this.findOne(id);

    const { startDate, endDate, ...data } = updateExperienceDto;

    /*
     * Existing images remain untouched.
     */
    let imageUrls = existingExperience.images;

    /*
     * If new images were selected,
     * upload them and append them.
     */
    if (images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((image) =>
          this.cloudinaryService.uploadImage(image, 'experiences'),
        ),
      );

      const newImageUrls = uploadedImages.map((image) => image.url);

      imageUrls = [...existingExperience.images, ...newImageUrls];
    }

    return this.prisma.experience.update({
      where: {
        id,
      },

      data: {
        ...data,

        images: imageUrls,

        ...(startDate !== undefined && {
          startDate: new Date(startDate),
        }),

        ...(endDate !== undefined && {
          endDate: endDate ? new Date(endDate) : null,
        }),

        /*
         * If the experience is marked current,
         * there should be no end date.
         */
        ...(data.isCurrent === true && {
          endDate: null,
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.experience.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Experience deleted successfully',
    };
  }
}
