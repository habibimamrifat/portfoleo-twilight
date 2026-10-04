import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CloudinaryService } from '../../helpers/cloudinary/cloudanry.service';

import {
  CreateAboutMeDto,
  CreateWorkSectorDto,
  UpdateAboutMeDto,
  UpdateWorkSectorDto,
} from './dto/about-me.dto';

@Injectable()
export class AboutMeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /*
   * =========================================================
   * ABOUT ME
   * =========================================================
   */

  async findOne() {
    const aboutMe = await this.prisma.aboutMe.findFirst({
      include: {
        workSectors: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!aboutMe) {
      throw new NotFoundException('About me not found');
    }

    return aboutMe;
  }

  async create(userId: string, createAboutMeDto: CreateAboutMeDto) {
    const existingAboutMe = await this.prisma.aboutMe.findUnique({
      where: {
        userId,
      },
    });

    if (existingAboutMe) {
      throw new ConflictException('About me already exists');
    }

    return this.prisma.aboutMe.create({
      data: {
        userId,
        detailAboutMe: createAboutMeDto.detailAboutMe,
      },
    });
  }

  async update(updateAboutMeDto: UpdateAboutMeDto) {
    const aboutMe = await this.prisma.aboutMe.findFirst();

    if (!aboutMe) {
      throw new NotFoundException('About me not found');
    }

    return this.prisma.aboutMe.update({
      where: {
        id: aboutMe.id,
      },
      data: {
        ...(updateAboutMeDto.detailAboutMe !== undefined && {
          detailAboutMe: updateAboutMeDto.detailAboutMe,
        }),
      },
    });
  }

  /*
   * =========================================================
   * WORK SECTORS
   * =========================================================
   */

  async findAllSectors() {
    const aboutMe = await this.prisma.aboutMe.findFirst({
      select: {
        id: true,
      },
    });

    if (!aboutMe) {
      throw new NotFoundException('About me not found');
    }

    return this.prisma.workSector.findMany({
      where: {
        aboutMeId: aboutMe.id,
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async createSector(
    userId: string,
    createWorkSectorDto: CreateWorkSectorDto,
    sectorImg?: Express.Multer.File,
  ) {
    const aboutMe = await this.prisma.aboutMe.findUnique({
      where: {
        userId,
      },
    });

    if (!aboutMe) {
      throw new NotFoundException('About me not found. Create About Me first.');
    }

    if (!sectorImg) {
      throw new ConflictException('Sector image is required');
    }

    const uploadedImage = await this.cloudinaryService.uploadImage(
      sectorImg,
      'about-me/sectors',
    );

    return this.prisma.workSector.create({
      data: {
        aboutMeId: aboutMe.id,

        sectorImg: uploadedImage.url,

        sectorName: createWorkSectorDto.sectorName,

        sectorDetail: createWorkSectorDto.sectorDetail,

        sortOrder: createWorkSectorDto.sortOrder ?? 0,

        isActive: createWorkSectorDto.isActive ?? true,
      },
    });
  }

  async findOneSector(id: string) {
    const sector = await this.prisma.workSector.findUnique({
      where: {
        id,
      },
    });

    if (!sector) {
      throw new NotFoundException('Work sector not found');
    }

    return sector;
  }

  async updateSector(
    id: string,
    updateWorkSectorDto: UpdateWorkSectorDto,
    sectorImg?: Express.Multer.File,
  ) {
    const existingSector = await this.findOneSector(id);

    let imageUrl = existingSector.sectorImg;

    if (sectorImg) {
      const uploadedImage = await this.cloudinaryService.uploadImage(
        sectorImg,
        'about-me/sectors',
      );

      imageUrl = uploadedImage.url;
    }

    return this.prisma.workSector.update({
      where: {
        id,
      },
      data: {
        ...(updateWorkSectorDto.sectorName !== undefined && {
          sectorName: updateWorkSectorDto.sectorName,
        }),

        ...(updateWorkSectorDto.sectorDetail !== undefined && {
          sectorDetail: updateWorkSectorDto.sectorDetail,
        }),

        ...(updateWorkSectorDto.sortOrder !== undefined && {
          sortOrder: updateWorkSectorDto.sortOrder,
        }),

        ...(updateWorkSectorDto.isActive !== undefined && {
          isActive: updateWorkSectorDto.isActive,
        }),

        ...(sectorImg && {
          sectorImg: imageUrl,
        }),
      },
    });
  }

  async removeSector(id: string) {
    await this.findOneSector(id);

    await this.prisma.workSector.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Work sector deleted successfully',
    };
  }
}
