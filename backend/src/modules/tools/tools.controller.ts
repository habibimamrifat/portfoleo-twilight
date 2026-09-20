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

import { CreateToolDto, UpdateToolDto } from './dto/tool.dto';
import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';
import { ResponseMessage } from '../../decorators/response-message.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ToolsService } from './tools.service';
import type { CurrentUserType } from '../../types/currentUser';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Tools retrieved successfully')
  findAll() {
    return this.toolsService.findAll();
  }

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Tool created successfully')
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() body: Record<string, string>,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    const createToolDto: CreateToolDto = {
      name: body.name,
      description: body.description,
      category: body.category as CreateToolDto['category'],
      sortOrder:
        body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      isActive:
        body.isActive !== undefined ? body.isActive === 'true' : undefined,
    };

    return this.toolsService.create(user.sub, createToolDto, logo);
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Tool retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(id);
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Tool updated successfully')
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @Body() body: Record<string, string>,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    const updateToolDto: UpdateToolDto = {
      ...(body.name !== undefined && {
        name: body.name,
      }),

      ...(body.description !== undefined && {
        description: body.description,
      }),

      ...(body.category !== undefined && {
        category: body.category as UpdateToolDto['category'],
      }),

      ...(body.sortOrder !== undefined && {
        sortOrder: Number(body.sortOrder),
      }),

      ...(body.isActive !== undefined && {
        isActive: body.isActive === 'true',
      }),
    };

    return this.toolsService.update(id, updateToolDto, logo);
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Tool deleted successfully')
  remove(@Param('id') id: string) {
    return this.toolsService.remove(id);
  }
}
