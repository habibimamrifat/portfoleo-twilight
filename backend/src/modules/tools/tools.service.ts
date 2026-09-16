import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateToolDto, UpdateToolDto } from './dto/tool.dto';

@Injectable()
export class ToolsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(userId: string, createToolDto: CreateToolDto) {
    return this.prisma.tool.create({
      data: {
        ...createToolDto,
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

  async update(id: string, updateToolDto: UpdateToolDto) {
    await this.findOne(id);

    return this.prisma.tool.update({
      where: {
        id,
      },
      data: {
        ...updateToolDto,
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
