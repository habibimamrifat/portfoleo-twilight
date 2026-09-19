import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { SystemService } from './system.service';

import { CreateSystemDto, UpdateSystemDto } from './dto/system.dto';

import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

import { ResponseMessage } from '../../decorators/response-message.decorator';

import { CurrentUser } from '../../decorators/current-user.decorator';
import type { CurrentUserType } from '../../types/currentUser';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  /*
   * =====================================================
   * PUBLIC
   * =====================================================
   */

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('System settings retrieved successfully')
  findPublic() {
    return this.systemService.findPublic();
  }

  /*
   * =====================================================
   * ADMIN
   * =====================================================
   */

  /*
   * Create settings
   */
  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('System settings created successfully')
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateSystemDto) {
    return this.systemService.create(user.sub, dto);
  }

  /*
   * Get all settings
   */
  @Get('all')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('System settings retrieved successfully')
  findAll() {
    return this.systemService.findAll();
  }

  /*
   * Create or update settings
   */
  @Post('upsert')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('System settings saved successfully')
  upsert(@CurrentUser() user: CurrentUserType, @Body() dto: UpdateSystemDto) {
    return this.systemService.upsert(user.sub, dto);
  }

  /*
   * Get settings by ID
   */
  @Get(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('System settings retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.systemService.findOne(id);
  }

  /*
   * Update settings by ID
   */
  @Patch(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('System settings updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateSystemDto) {
    return this.systemService.update(id, dto);
  }

  /*
   * Delete settings
   */
  @Delete(':id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('System settings deleted successfully')
  remove(@Param('id') id: string) {
    return this.systemService.remove(id);
  }
}
