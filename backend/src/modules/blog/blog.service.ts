import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BlogStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { CloudinaryService } from '../../helpers/cloudinary/cloudanry.service';

import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =========================
  // PUBLIC
  // =========================

  async findAllPublic() {
    return this.prisma.blogPost.findMany({
      where: {
        status: BlogStatus.PUBLISHED,
      },

      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        publishedAt: 'desc',
      },
    });
  }

  async findPublicBySlug(slug: string) {
    const blog = await this.prisma.blogPost.findFirst({
      where: {
        slug,
        status: BlogStatus.PUBLISHED,
      },

      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  // =========================
  // ADMIN
  // =========================

  async create(
    userId: string,
    dto: CreateBlogDto,
    coverImage?: Express.Multer.File,
  ) {
    const existingBlog = await this.prisma.blogPost.findUnique({
      where: {
        slug: dto.slug,
      },
    });

    if (existingBlog) {
      throw new ConflictException('A blog post with this slug already exists');
    }

    // =========================
    // UPLOAD COVER IMAGE
    // =========================

    let coverImageUrl: string | undefined;

    if (coverImage) {
      const result = await this.cloudinaryService.uploadImage(
        coverImage,
        'blog-posts',
      );

      coverImageUrl = result.url;
    }

    // =========================
    // PUBLISHED DATE
    // =========================

    let publishedAt: Date | undefined;

    if (dto.status === BlogStatus.PUBLISHED) {
      publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : new Date();
    } else if (dto.publishedAt) {
      publishedAt = new Date(dto.publishedAt);
    }

    // =========================
    // CREATE
    // =========================

    return this.prisma.blogPost.create({
      data: {
        userId,

        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,

        coverImage: coverImageUrl,

        status: dto.status ?? BlogStatus.DRAFT,

        publishedAt,
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.blogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneAdmin(id: string) {
    const blog = await this.prisma.blogPost.findUnique({
      where: {
        id,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog post not found');
    }

    return blog;
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    coverImage?: Express.Multer.File,
  ) {
    const existingBlog = await this.prisma.blogPost.findUnique({
      where: {
        id,
      },
    });

    if (!existingBlog) {
      throw new NotFoundException('Blog post not found');
    }

    // =========================
    // CHECK SLUG
    // =========================

    if (dto.slug && dto.slug !== existingBlog.slug) {
      const slugExists = await this.prisma.blogPost.findUnique({
        where: {
          slug: dto.slug,
        },
      });

      if (slugExists) {
        throw new ConflictException(
          'A blog post with this slug already exists',
        );
      }
    }

    // =========================
    // UPLOAD NEW COVER IMAGE
    // =========================

    let coverImageUrl: string | undefined;

    if (coverImage) {
      const result = await this.cloudinaryService.uploadImage(
        coverImage,
        'blog-posts',
      );

      coverImageUrl = result.url;
    }

    // =========================
    // PUBLISHED DATE
    // =========================

    let publishedAt: Date | null | undefined;

    if (dto.status === BlogStatus.PUBLISHED) {
      publishedAt =
        dto.publishedAt !== undefined
          ? new Date(dto.publishedAt)
          : (existingBlog.publishedAt ?? new Date());
    } else if (
      dto.status === BlogStatus.DRAFT ||
      dto.status === BlogStatus.ARCHIVED
    ) {
      publishedAt = null;
    } else if (dto.publishedAt !== undefined) {
      publishedAt = new Date(dto.publishedAt);
    }

    // =========================
    // UPDATE DATA
    // =========================

    const data: Prisma.BlogPostUpdateInput = {
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt,
      content: dto.content,
      status: dto.status,
    };

    if (coverImageUrl !== undefined) {
      data.coverImage = coverImageUrl;
    }

    if (publishedAt !== undefined) {
      data.publishedAt = publishedAt;
    }

    // =========================
    // UPDATE
    // =========================

    return this.prisma.blogPost.update({
      where: {
        id,
      },

      data,
    });
  }

  async remove(id: string) {
    const existingBlog = await this.prisma.blogPost.findUnique({
      where: {
        id,
      },
    });

    if (!existingBlog) {
      throw new NotFoundException('Blog post not found');
    }

    return this.prisma.blogPost.delete({
      where: {
        id,
      },
    });
  }
}
