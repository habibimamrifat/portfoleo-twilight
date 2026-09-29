import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CloudinaryService } from '../../helpers/cloudinary/cloudanry.service';

import {
  CreateProcessStepDto,
  UpdateProcessStepDto,
} from './dto/process-step.dto';

@Injectable()
export class ProcessStepsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.prisma.processStep.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        detail: true,
        img: true,
        sortOrder: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async create(
    userId: string,
    createProcessStepDto: CreateProcessStepDto,
    img?: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;

    if (img) {
      const uploadedImage = await this.cloudinaryService.uploadImage(
        img,
        'process-steps',
      );

      imageUrl = uploadedImage.url;
    }

    return this.prisma.processStep.create({
      data: {
        ...createProcessStepDto,

        img: imageUrl,

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const processStep = await this.prisma.processStep.findUnique({
      where: {
        id,
      },
    });

    if (!processStep) {
      throw new NotFoundException('Process step not found');
    }

    return processStep;
  }

  async update(
    id: string,
    updateProcessStepDto: UpdateProcessStepDto,
    img?: Express.Multer.File,
  ) {
    const existingProcessStep = await this.findOne(id);

    let imageUrl = existingProcessStep.img;

    if (img) {
      const uploadedImage = await this.cloudinaryService.uploadImage(
        img,
        'process-steps',
      );

      imageUrl = uploadedImage.url;
    }

    return this.prisma.processStep.update({
      where: {
        id,
      },
      data: {
        ...updateProcessStepDto,

        img: imageUrl,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.processStep.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Process step deleted successfully',
    };
  }
}
