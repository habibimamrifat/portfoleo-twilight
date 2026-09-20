import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateToolDto, UpdateToolDto } from './dto/tool.dto';
import { CloudinaryService } from '../../helpers/cloudinary/cloudanry.service';

@Injectable()
export class ToolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.prisma.tool.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        description: true,
        category: true,
        sortOrder: true,
        isActive: true,
      },
      orderBy: [
        {
          category: 'asc',
        },
        {
          sortOrder: 'asc',
        },
      ],
    });
  }

  async create(
    userId: string,
    createToolDto: CreateToolDto,
    logo?: Express.Multer.File,
  ) {
    let logoUrl: string | undefined;

    if (logo) {
      const uploaded = await this.cloudinaryService.uploadImage(
        logo,
        'portfolio/tools',
      );

      logoUrl = uploaded.url;
    }

    return this.prisma.tool.create({
      data: {
        name: createToolDto.name,
        description: createToolDto.description,
        category: createToolDto.category,
        sortOrder: createToolDto.sortOrder ?? 0,
        isActive: createToolDto.isActive ?? true,

        ...(logoUrl && {
          logo: logoUrl,
        }),

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const tool = await this.prisma.tool.findUnique({
      where: {
        id,
      },
    });

    if (!tool) {
      throw new NotFoundException('Tool not found');
    }

    return tool;
  }

  async update(
    id: string,
    updateToolDto: UpdateToolDto,
    logo?: Express.Multer.File,
  ) {
    await this.findOne(id);

    let logoUrl: string | undefined;

    if (logo) {
      const uploaded = await this.cloudinaryService.uploadImage(
        logo,
        'portfolio/tools',
      );

      logoUrl = uploaded.url;
    }

    return this.prisma.tool.update({
      where: {
        id,
      },
      data: {
        ...(updateToolDto.name !== undefined && {
          name: updateToolDto.name,
        }),

        ...(updateToolDto.description !== undefined && {
          description: updateToolDto.description,
        }),

        ...(updateToolDto.category !== undefined && {
          category: updateToolDto.category,
        }),

        ...(updateToolDto.sortOrder !== undefined && {
          sortOrder: updateToolDto.sortOrder,
        }),

        ...(updateToolDto.isActive !== undefined && {
          isActive: updateToolDto.isActive,
        }),

        ...(logoUrl && {
          logo: logoUrl,
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.tool.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Tool deleted successfully',
    };
  }
}
