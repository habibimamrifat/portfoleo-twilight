import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../helpers/cloudinary/cloudanry.service';

import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.prisma.project.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        liveLink: true,
        githubLink: true,
        status: true,
        platform: true,
        approachTaken: true,
        featured: true,
        sortOrder: true,
      },
      orderBy: [
        {
          featured: 'desc',
        },
        {
          sortOrder: 'asc',
        },
      ],
    });
  }

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
    images: Express.Multer.File[],
  ) {
    /*
     * Upload all project images to Cloudinary.
     */
    const uploadedImages = await Promise.all(
      images.map((image) =>
        this.cloudinaryService.uploadImage(image, 'projects'),
      ),
    );

    /*
     * Extract the Cloudinary URLs.
     */
    const imageUrls = uploadedImages.map((image) => image.url);

    /*
     * Create the project with the uploaded image URLs.
     */
    return this.prisma.project.create({
      data: {
        ...createProjectDto,

        images: imageUrls,

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    images: Express.Multer.File[],
  ) {
    /*
     * Make sure the project exists first.
     */
    const existingProject = await this.findOne(id);

    /*
     * Keep the existing images by default.
     */
    let imageUrls = existingProject.images;

    /*
     * If new images were uploaded,
     * upload them and append them to
     * the existing images.
     */
    if (images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map((image) =>
          this.cloudinaryService.uploadImage(image, 'projects'),
        ),
      );

      const newImageUrls = uploadedImages.map((image) => image.url);

      imageUrls = [...existingProject.images, ...newImageUrls];
    }

    /*
     * Update the project.
     */
    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        ...updateProjectDto,

        images: imageUrls,
      },
    });
  }

  async remove(id: string) {
    /*
     * Make sure the project exists.
     */
    await this.findOne(id);

    /*
     * Delete the project from the database.
     */
    await this.prisma.project.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Project deleted successfully',
    };
  }
}
