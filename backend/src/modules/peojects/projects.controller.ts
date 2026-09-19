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

import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

import { CurrentUser } from '../../decorators/current-user.decorator';
import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';
import { ResponseMessage } from '../../decorators/response-message.decorator';

import { ProjectsService } from './projects.service';

import type { CurrentUserType } from '../../types/currentUser';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Projects retrieved successfully')
  findAll() {
    return this.projectsService.findAll();
  }

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project created successfully')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
    }),
  )
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.projectsService.create(
      user.sub,
      createProjectDto,
      images ?? [],
    );
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project updated successfully')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.projectsService.update(id, updateProjectDto, images ?? []);
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project deleted successfully')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
