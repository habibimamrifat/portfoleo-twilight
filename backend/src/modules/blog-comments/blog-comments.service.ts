import { Injectable, NotFoundException } from '@nestjs/common';

import { BlogStatus, CommentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from './dto/blog-comments.dto';

@Injectable()
export class BlogCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // PUBLIC
  // =========================

  async create(
    dto: CreateBlogCommentDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const blog = await this.prisma.blogPost.findFirst({
      where: {
        id: dto.blogPostId,
        status: BlogStatus.PUBLISHED,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return this.prisma.blogComment.create({
      data: {
        blogPostId: dto.blogPostId,

        name: dto.name,
        email: dto.email,
        comment: dto.comment,

        ipAddress,
        userAgent,

        status: CommentStatus.PENDING,
      },
    });
  }

  async findApprovedByPost(postId: string) {
    return this.prisma.blogComment.findMany({
      where: {
        blogPostId: postId,

        status: CommentStatus.APPROVED,

        blogPost: {
          status: BlogStatus.PUBLISHED,
        },
      },

      select: {
        id: true,
        name: true,
        comment: true,
        createdAt: true,
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
    return this.prisma.blogComment.findMany({
      include: {
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneAdmin(id: string) {
    const comment = await this.prisma.blogComment.findUnique({
      where: {
        id,
      },

      include: {
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Blog comment not found');
    }

    return comment;
  }

  async update(id: string, dto: UpdateBlogCommentDto) {
    const comment = await this.prisma.blogComment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new NotFoundException('Blog comment not found');
    }

    return this.prisma.blogComment.update({
      where: {
        id,
      },

      data: {
        status: dto.status,
      },
    });
  }

  async remove(id: string) {
    const comment = await this.prisma.blogComment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new NotFoundException('Blog comment not found');
    }

    return this.prisma.blogComment.delete({
      where: {
        id,
      },
    });
  }

  async findAllAdminByPost(postId: string) {
    return this.prisma.blogComment.findMany({
      where: {
        blogPostId: postId,
      },

      select: {
        id: true,
        blogPostId: true,
        name: true,
        email: true,
        comment: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
