import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateSystemDto, UpdateSystemDto } from './dto/system.dto';

@Injectable()
export class SystemService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   * Create settings for a user
   */
  async create(userId: string, dto: CreateSystemDto) {
    const existingSettings = await this.prisma.systemSettings.findUnique({
      where: {
        userId,
      },
    });

    if (existingSettings) {
      return existingSettings;
    }

    return this.prisma.systemSettings.create({
      data: {
        userId,

        backgroundColor: dto.backgroundColor,

        moonlightColor: dto.moonlightColor,

        particleCount: dto.particleCount,

        particleColor: dto.particleColor,

        particleLinksEnabled: dto.particleLinksEnabled,

        particleLinkColor: dto.particleLinkColor,

        cardColor: dto.cardColor,

        buttonColor: dto.buttonColor,
      },
    });
  }

  /*
   * Public settings
   *
   * Used by the portfolio frontend.
   */
  async findPublic() {
    const settings = await this.prisma.systemSettings.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        backgroundColor: true,
        moonlightColor: true,

        particleCount: true,
        particleColor: true,

        particleLinksEnabled: true,
        particleLinkColor: true,

        cardColor: true,
        buttonColor: true,
      },
    });

    return settings;
  }

  /*
   * Admin: get all settings
   */
  async findAll() {
    return this.prisma.systemSettings.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /*
   * Admin: get one settings record
   */
  async findOne(id: string) {
    const settings = await this.prisma.systemSettings.findUnique({
      where: {
        id,
      },
    });

    if (!settings) {
      throw new NotFoundException('System settings not found');
    }

    return settings;
  }

  /*
   * Admin: update by settings ID
   */
  async update(id: string, dto: UpdateSystemDto) {
    const existingSettings = await this.prisma.systemSettings.findUnique({
      where: {
        id,
      },
    });

    if (!existingSettings) {
      throw new NotFoundException('System settings not found');
    }

    return this.prisma.systemSettings.update({
      where: {
        id,
      },

      data: {
        ...(dto.backgroundColor !== undefined && {
          backgroundColor: dto.backgroundColor,
        }),

        ...(dto.moonlightColor !== undefined && {
          moonlightColor: dto.moonlightColor,
        }),

        ...(dto.particleCount !== undefined && {
          particleCount: dto.particleCount,
        }),

        ...(dto.particleColor !== undefined && {
          particleColor: dto.particleColor,
        }),

        ...(dto.particleLinksEnabled !== undefined && {
          particleLinksEnabled: dto.particleLinksEnabled,
        }),

        ...(dto.particleLinkColor !== undefined && {
          particleLinkColor: dto.particleLinkColor,
        }),

        ...(dto.cardColor !== undefined && {
          cardColor: dto.cardColor,
        }),

        ...(dto.buttonColor !== undefined && {
          buttonColor: dto.buttonColor,
        }),
      },
    });
  }

  /*
   * Admin: create or update settings
   *
   * This is the main method used by the dashboard.
   */
  async upsert(userId: string, dto: UpdateSystemDto) {
    return this.prisma.systemSettings.upsert({
      where: {
        userId,
      },

      create: {
        userId,

        backgroundColor: dto.backgroundColor,

        moonlightColor: dto.moonlightColor,

        particleCount: dto.particleCount,

        particleColor: dto.particleColor,

        particleLinksEnabled: dto.particleLinksEnabled,

        particleLinkColor: dto.particleLinkColor,

        cardColor: dto.cardColor,

        buttonColor: dto.buttonColor,
      },

      update: {
        ...(dto.backgroundColor !== undefined && {
          backgroundColor: dto.backgroundColor,
        }),

        ...(dto.moonlightColor !== undefined && {
          moonlightColor: dto.moonlightColor,
        }),

        ...(dto.particleCount !== undefined && {
          particleCount: dto.particleCount,
        }),

        ...(dto.particleColor !== undefined && {
          particleColor: dto.particleColor,
        }),

        ...(dto.particleLinksEnabled !== undefined && {
          particleLinksEnabled: dto.particleLinksEnabled,
        }),

        ...(dto.particleLinkColor !== undefined && {
          particleLinkColor: dto.particleLinkColor,
        }),

        ...(dto.cardColor !== undefined && {
          cardColor: dto.cardColor,
        }),

        ...(dto.buttonColor !== undefined && {
          buttonColor: dto.buttonColor,
        }),
      },
    });
  }

  /*
   * Admin: delete settings
   */
  async remove(id: string) {
    const existingSettings = await this.prisma.systemSettings.findUnique({
      where: {
        id,
      },
    });

    if (!existingSettings) {
      throw new NotFoundException('System settings not found');
    }

    await this.prisma.systemSettings.delete({
      where: {
        id,
      },
    });

    return {
      id,
    };
  }
}
