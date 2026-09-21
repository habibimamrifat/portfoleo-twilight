import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import {
  CreateProjectCommentDto,
  UpdateProjectCommentDto,
} from './dto/project-comment.dto';

@Injectable()
export class ProjectCommentService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // PUBLIC
  // =========================

  async create(
    dto: CreateProjectCommentDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: dto.projectId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projectComment.create({
      data: {
        projectId: dto.projectId,

        name: dto.name,

        email: dto.email || null,

        comment: dto.comment,

        ipAddress: ipAddress || null,

        userAgent: userAgent || null,
      },
    });
  }

  async findApprovedByProject(projectId: string) {
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

    return this.prisma.projectComment.findMany({
      where: {
        projectId,
        status: 'APPROVED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // =========================
  // ADMIN
  // =========================

  async findAllAdmin() {
    return this.prisma.projectComment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneAdmin(id: string) {
    const comment = await this.prisma.projectComment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new NotFoundException('Project comment not found');
    }

    return comment;
  }

  async update(id: string, dto: UpdateProjectCommentDto) {
    const comment = await this.prisma.projectComment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new NotFoundException('Project comment not found');
    }

    return this.prisma.projectComment.update({
      where: {
        id,
      },
      data: {
        status: dto.status,
      },
    });
  }

  async remove(id: string) {
    const comment = await this.prisma.projectComment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Project comment not found');
    }

    await this.prisma.projectComment.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Project comment deleted successfully',
    };
  }
}
