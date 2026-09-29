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
  CreateProcessStepDto,
  UpdateProcessStepDto,
} from './dto/process-step.dto';

import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

import { ResponseMessage } from '../../decorators/response-message.decorator';

import { CurrentUser } from '../../decorators/current-user.decorator';
import { ProcessStepsService } from './process-step.service';
import type { CurrentUserType } from '../../types/currentUser';

@Controller('process-steps')
export class ProcessStepsController {
  constructor(private readonly processStepsService: ProcessStepsService) {}

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Process steps retrieved successfully')
  findAll() {
    return this.processStepsService.findAll();
  }

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Process step created successfully')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: memoryStorage(),
    }),
  )
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() createProcessStepDto: CreateProcessStepDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.processStepsService.create(user.sub, createProcessStepDto, img);
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Process step retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.processStepsService.findOne(id);
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Process step updated successfully')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: memoryStorage(),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProcessStepDto: UpdateProcessStepDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.processStepsService.update(id, updateProcessStepDto, img);
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Process step deleted successfully')
  remove(@Param('id') id: string) {
    return this.processStepsService.remove(id);
  }
}
