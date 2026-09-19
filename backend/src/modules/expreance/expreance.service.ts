import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateExperienceDto, UpdateExperienceDto } from './dto/expreance.dto';

import { CloudinaryService } from '../../helpers/cloudinary/cloudanry.service';

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
    const existingExperience = await this.findOne(id);

    const { startDate, endDate, ...data } = updateExperienceDto;

    let imageUrls = existingExperience.images;

    /*
     * Upload newly selected images.
     *
     * Existing images remain untouched.
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
