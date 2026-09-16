import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

import { ResponseMessage } from '../../decorators/response-message.decorator';

import { CurrentUser } from '../../decorators/current-user.decorator';
import { ExperiencesService } from './expreance.service';
import type { CurrentUserType } from '../../types/currentUser';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/expreance.dto';

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
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() createExperienceDto: CreateExperienceDto,
  ) {
    return this.experiencesService.create(user.sub, createExperienceDto);
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
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Experience deleted successfully')
  remove(@Param('id') id: string) {
    return this.experiencesService.remove(id);
  }
}
