import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,

        img: createUserDto.img,
        phone: createUserDto.phone,
        location: createUserDto.location,
        description: createUserDto.description,

        githubUrl: createUserDto.githubUrl,
        linkedinUrl: createUserDto.linkedinUrl,
        resumeUrl: createUserDto.resumeUrl,
      },
      select: this.publicUserSelect(),
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: this.publicUserSelect(),
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: this.publicUserSelect(),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });

      if (emailExists) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    const data: {
      name?: string;
      email?: string;
      passwordHash?: string;
      img?: string;
      phone?: string;
      location?: string;
      description?: string;
      githubUrl?: string;
      linkedinUrl?: string;
      resumeUrl?: string;
    } = {};

    if (updateUserDto.name !== undefined) {
      data.name = updateUserDto.name;
    }

    if (updateUserDto.email !== undefined) {
      data.email = updateUserDto.email;
    }

    if (updateUserDto.password !== undefined) {
      data.passwordHash = await bcrypt.hash(updateUserDto.password, 12);
    }

    if (updateUserDto.img !== undefined) {
      data.img = updateUserDto.img;
    }

    if (updateUserDto.phone !== undefined) {
      data.phone = updateUserDto.phone;
    }

    if (updateUserDto.location !== undefined) {
      data.location = updateUserDto.location;
    }

    if (updateUserDto.description !== undefined) {
      data.description = updateUserDto.description;
    }

    if (updateUserDto.githubUrl !== undefined) {
      data.githubUrl = updateUserDto.githubUrl;
    }

    if (updateUserDto.linkedinUrl !== undefined) {
      data.linkedinUrl = updateUserDto.linkedinUrl;
    }

    if (updateUserDto.resumeUrl !== undefined) {
      data.resumeUrl = updateUserDto.resumeUrl;
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: this.publicUserSelect(),
    });
  }

  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      id,
    };
  }

  private publicUserSelect() {
    return {
      id: true,
      name: true,
      email: true,
      img: true,
      phone: true,
      location: true,
      description: true,
      githubUrl: true,
      linkedinUrl: true,
      resumeUrl: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
