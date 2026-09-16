import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

import { CurrentUser } from '../../decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';
import { ResponseMessage } from '../../decorators/response-message.decorator';
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
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(user.sub, createProjectDto);
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
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Project deleted successfully')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
