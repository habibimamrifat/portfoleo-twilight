import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

import { ServicesService } from './service.service';

import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

import { ResponseMessage } from '../../decorators/response-message.decorator';

import { CurrentUser } from '../../decorators/current-user.decorator';
import type { CurrentUserType } from '../../types/currentUser';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Services retrieved successfully')
  findAll() {
    return this.servicesService.findAll();
  }

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Service created successfully')
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.create(user.sub, createServiceDto);
  }

  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Service retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Service updated successfully')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Service deleted successfully')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
