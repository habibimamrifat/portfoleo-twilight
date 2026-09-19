import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';

import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

import { ResponseMessage } from '../../decorators/response-message.decorator';

import { CurrentUser } from '../../decorators/current-user.decorator';

import type { CurrentUserType } from '../../types/currentUser';

import { CreateExperienceDto, UpdateExperienceDto } from './dto/expreance.dto';

import { ExperiencesService } from './expreance.service';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Experiences retrieved successfully')
  findAll() {
    return this.experiencesService.findAll();
  }

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Experience created successfully')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
    }),
  )
  create(
    @CurrentUser() user: CurrentUserType,

    @Body()
    createExperienceDto: CreateExperienceDto,

    @UploadedFiles()
    images: Express.Multer.File[],
  ) {
    return this.experiencesService.create(
      user.sub,
      createExperienceDto,
      images ?? [],
    );
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Experience retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Experience updated successfully')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id') id: string,

    @Body()
    updateExperienceDto: UpdateExperienceDto,

    @UploadedFiles()
    images: Express.Multer.File[],
  ) {
    return this.experiencesService.update(
      id,
      updateExperienceDto,
      images ?? [],
    );
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Experience deleted successfully')
  remove(@Param('id') id: string) {
    return this.experiencesService.remove(id);
  }
}
