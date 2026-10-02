import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import {
  CreateProjectApproachDto,
  UpdateProjectApproachDto,
} from './dto/project-approach.dto';

import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

import { ResponseMessage } from '../../decorators/response-message.decorator';

import { ProjectApproachService } from './project-approach.service';

@Controller('projects')
export class ProjectApproachController {
  constructor(
    private readonly projectApproachService: ProjectApproachService,
  ) {}

  @Get(':projectId/approaches')
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Project approaches retrieved successfully')
  findAll(@Param('projectId') projectId: string) {
    return this.projectApproachService.findAll(projectId);
  }

  @Post(':projectId/approaches')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project approach created successfully')
  @UseInterceptors(
    FileInterceptor('approachImg', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Param('projectId') projectId: string,

    @Body()
    createProjectApproachDto: CreateProjectApproachDto,

    @UploadedFile()
    approachImg?: Express.Multer.File,
  ) {
    return this.projectApproachService.create(
      projectId,
      createProjectApproachDto,
      approachImg,
    );
  }

  @Get(':projectId/approaches/:id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project approach retrieved successfully')
  findOne(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.projectApproachService.findOne(id);
  }

  @Patch(':projectId/approaches/:id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project approach updated successfully')
  @UseInterceptors(
    FileInterceptor('approachImg', {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,

    @Body()
    updateProjectApproachDto: UpdateProjectApproachDto,

    @UploadedFile()
    approachImg?: Express.Multer.File,
  ) {
    return this.projectApproachService.update(
      id,
      updateProjectApproachDto,
      approachImg,
    );
  }

  @Delete(':projectId/approaches/:id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project approach deleted successfully')
  remove(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.projectApproachService.remove(id);
  }
}
