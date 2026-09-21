import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';

import { ProjectCommentService } from './project-comment.service';
import {
  CreateProjectCommentDto,
  UpdateProjectCommentDto,
} from './dto/project-comment.dto';

import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

import type { Request } from 'express';

@Controller('project-comments')
export class ProjectCommentController {
  constructor(private readonly projectCommentService: ProjectCommentService) {}

  // =========================
  // PUBLIC
  // =========================

  @Post()
  @RouteFor(routeTypeObj.PUBLIC)
  async create(@Body() dto: CreateProjectCommentDto, @Req() request: Request) {
    const ipAddress =
      request.ip || request.headers['x-forwarded-for']?.toString();

    const userAgent = request.headers['user-agent'];

    return {
      data: await this.projectCommentService.create(dto, ipAddress, userAgent),
    };
  }

  @Get('project/:projectId')
  @RouteFor(routeTypeObj.PUBLIC)
  async findApprovedByProject(@Param('projectId') projectId: string) {
    return {
      data: await this.projectCommentService.findApprovedByProject(projectId),
    };
  }

  // =========================
  // ADMIN
  // =========================

  @Get()
  @RouteFor(routeTypeObj.ADMIN)
  async findAllAdmin() {
    return {
      data: await this.projectCommentService.findAllAdmin(),
    };
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async findOneAdmin(@Param('id') id: string) {
    return {
      data: await this.projectCommentService.findOneAdmin(id),
    };
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateProjectCommentDto) {
    return {
      data: await this.projectCommentService.update(id, dto),
    };
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async remove(@Param('id') id: string) {
    return {
      data: await this.projectCommentService.remove(id),
    };
  }
}
