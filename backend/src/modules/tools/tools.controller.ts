import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

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
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() createToolDto: CreateToolDto,
  ) {
    return this.toolsService.create(user.sub, createToolDto);
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
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolsService.update(id, updateToolDto);
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Tool deleted successfully')
  remove(@Param('id') id: string) {
    return this.toolsService.remove(id);
  }
}
