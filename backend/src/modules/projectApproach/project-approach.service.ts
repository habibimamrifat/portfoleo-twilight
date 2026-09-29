import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CloudinaryService } from '../../helpers/cloudinary/cloudanry.service';

import {
  CreateProjectApproachDto,
  UpdateProjectApproachDto,
} from './dto/project-approach.dto';

@Injectable()
export class ProjectApproachService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(projectId: string) {
    await this.ensureProjectExists(projectId);

    return this.prisma.projectApproach.findMany({
      where: {
        projectId,
        isActive: true,
      },

      select: {
        id: true,
        projectId: true,
        approachImg: true,
        approachTitle: true,
        detail: true,
        sortOrder: true,
        isActive: true,
      },

      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async create(
    projectId: string,
    createProjectApproachDto: CreateProjectApproachDto,
    approachImg?: Express.Multer.File,
  ) {
    await this.ensureProjectExists(projectId);

    let imageUrl: string | undefined;

    if (approachImg) {
      const uploadedImage = await this.cloudinaryService.uploadImage(
        approachImg,
        'project-approaches',
      );

      imageUrl = uploadedImage.url;
    }

    return this.prisma.projectApproach.create({
      data: {
        projectId,

        approachTitle: createProjectApproachDto.approachTitle,

        detail: createProjectApproachDto.detail,

        approachImg: imageUrl ?? createProjectApproachDto.approachImg ?? null,

        sortOrder: createProjectApproachDto.sortOrder ?? 0,

        isActive: createProjectApproachDto.isActive ?? true,
      },
    });
  }

  async findOne(id: string) {
    const approach = await this.prisma.projectApproach.findUnique({
      where: {
        id,
      },
    });

    if (!approach) {
      throw new NotFoundException('Project approach not found');
    }

    return approach;
  }

  async update(
    id: string,
    updateProjectApproachDto: UpdateProjectApproachDto,
    approachImg?: Express.Multer.File,
  ) {
    const existingApproach = await this.findOne(id);

    let imageUrl = existingApproach.approachImg;

    if (approachImg) {
      const uploadedImage = await this.cloudinaryService.uploadImage(
        approachImg,
        'project-approaches',
      );

      imageUrl = uploadedImage.url;
    }

    return this.prisma.projectApproach.update({
      where: {
        id,
      },

      data: {
        ...(updateProjectApproachDto.approachTitle !== undefined && {
          approachTitle: updateProjectApproachDto.approachTitle,
        }),

        ...(updateProjectApproachDto.detail !== undefined && {
          detail: updateProjectApproachDto.detail,
        }),

        ...(updateProjectApproachDto.sortOrder !== undefined && {
          sortOrder: updateProjectApproachDto.sortOrder,
        }),

        ...(updateProjectApproachDto.isActive !== undefined && {
          isActive: updateProjectApproachDto.isActive,
        }),

        ...(approachImg && {
          approachImg: imageUrl,
        }),

        ...(updateProjectApproachDto.approachImg !== undefined &&
          !approachImg && {
            approachImg: updateProjectApproachDto.approachImg,
          }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.projectApproach.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Project approach deleted successfully',
    };
  }

  private async ensureProjectExists(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },

      select: {
        id: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }
}
