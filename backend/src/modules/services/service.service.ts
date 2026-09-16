import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        sortOrder: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async create(userId: string, createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: {
        id,
      },
      data: {
        ...updateServiceDto,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.service.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Service deleted successfully',
    };
  }
}
