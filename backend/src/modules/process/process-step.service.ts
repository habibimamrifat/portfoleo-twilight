import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import {
  CreateProcessStepDto,
  UpdateProcessStepDto,
} from './dto/process-step.dto';

@Injectable()
export class ProcessStepsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.processStep.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        detail: true,
        sortOrder: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async create(userId: string, createProcessStepDto: CreateProcessStepDto) {
    return this.prisma.processStep.create({
      data: {
        ...createProcessStepDto,
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

  async update(id: string, updateProcessStepDto: UpdateProcessStepDto) {
    await this.findOne(id);

    return this.prisma.processStep.update({
      where: {
        id,
      },
      data: {
        ...updateProcessStepDto,
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
