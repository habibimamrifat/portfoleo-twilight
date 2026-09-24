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

import { BlogCommentsService } from './blog-comments.service';
import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';
import {
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from './dto/blog-comments.dto';
import type { Request } from 'express';

@Controller('blog-comments')
export class BlogCommentsController {
  constructor(private readonly blogCommentsService: BlogCommentsService) {}

  // =========================
  // PUBLIC
  // =========================

  @Post()
  @RouteFor(routeTypeObj.PUBLIC)
  async create(@Body() dto: CreateBlogCommentDto, @Req() request: Request) {
    const ipAddress =
      request.ip || request.headers['x-forwarded-for']?.toString();

    const userAgent = request.headers['user-agent'];

    return {
      data: await this.blogCommentsService.create(dto, ipAddress, userAgent),
    };
  }

  @Get('post/:postId')
  @RouteFor(routeTypeObj.PUBLIC)
  async findApprovedByPost(@Param('postId') postId: string) {
    return {
      data: await this.blogCommentsService.findApprovedByPost(postId),
    };
  }

  // =========================
  // ADMIN
  // =========================

  @Get()
  @RouteFor(routeTypeObj.ADMIN)
  async findAllAdmin() {
    return {
      data: await this.blogCommentsService.findAllAdmin(),
    };
  }

  @Get('admin/post/:postId')
  @RouteFor(routeTypeObj.ADMIN)
  async findAllAdminByPost(@Param('postId') postId: string) {
    return {
      data: await this.blogCommentsService.findAllAdminByPost(postId),
    };
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async findOneAdmin(@Param('id') id: string) {
    return {
      data: await this.blogCommentsService.findOneAdmin(id),
    };
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateBlogCommentDto) {
    return {
      data: await this.blogCommentsService.update(id, dto),
    };
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async remove(@Param('id') id: string) {
    return {
      data: await this.blogCommentsService.remove(id),
    };
  }
}
