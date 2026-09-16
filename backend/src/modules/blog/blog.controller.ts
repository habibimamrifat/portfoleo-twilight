import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { BlogService } from './blog.service';
import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';



@Controller('blog-posts')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // =========================
  // PUBLIC
  // =========================

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  async findAllPublic() {
    return {
      data: await this.blogService.findAllPublic(),
    };
  }

  @Get('slug/:slug')
  @RouteFor(routeTypeObj.PUBLIC)
  async findPublicBySlug(@Param('slug') slug: string) {
    return {
      data: await this.blogService.findPublicBySlug(slug),
    };
  }

  // =========================
  // ADMIN
  // =========================

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateBlogDto,
  ) {
    return {
      data: await this.blogService.create(user.sub, dto),
    };
  }

  @Get('admin/all')
  @RouteFor(routeTypeObj.ADMIN)
  async findAllAdmin() {
    return {
      data: await this.blogService.findAllAdmin(),
    };
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async findOneAdmin(@Param('id') id: string) {
    return {
      data: await this.blogService.findOneAdmin(id),
    };
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return {
      data: await this.blogService.update(id, dto),
    };
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  async remove(@Param('id') id: string) {
    return {
      data: await this.blogService.remove(id),
    };
  }
}
