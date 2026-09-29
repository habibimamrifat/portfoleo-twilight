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
  CreateAboutMeDto,
  CreateWorkSectorDto,
  UpdateAboutMeDto,
  UpdateWorkSectorDto,
} from './dto/about-me.dto';

import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';

import { ResponseMessage } from '../../decorators/response-message.decorator';

import { CurrentUser } from '../../decorators/current-user.decorator';
import type { CurrentUserType } from '../../types/currentUser';
import { AboutMeService } from './about-me.service';

@Controller('about-me')
export class AboutMeController {
  constructor(private readonly aboutMeService: AboutMeService) {}

  /*
   * =========================================================
   * ABOUT ME
   * =========================================================
   */

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('About me retrieved successfully')
  findOne() {
    return this.aboutMeService.findOne();
  }

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('About me created successfully')
  create(
    @CurrentUser() user: CurrentUserType,
    @Body() createAboutMeDto: CreateAboutMeDto,
  ) {
    return this.aboutMeService.create(user.sub, createAboutMeDto);
  }

  @Patch()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('About me updated successfully')
  update(@Body() updateAboutMeDto: UpdateAboutMeDto) {
    return this.aboutMeService.update(updateAboutMeDto);
  }

  /*
   * =========================================================
   * WORK SECTORS
   * =========================================================
   */

  @Get('sectors')
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Work sectors retrieved successfully')
  findAllSectors() {
    return this.aboutMeService.findAllSectors();
  }

  @Post('sectors')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Work sector created successfully')
  @UseInterceptors(
    FileInterceptor('sectorImg', {
      storage: memoryStorage(),
    }),
  )
  createSector(
    @CurrentUser() user: CurrentUserType,
    @Body() createWorkSectorDto: CreateWorkSectorDto,
    @UploadedFile() sectorImg?: Express.Multer.File,
  ) {
    return this.aboutMeService.createSector(
      user.sub,
      createWorkSectorDto,
      sectorImg,
    );
  }

  @Get('sectors/:id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Work sector retrieved successfully')
  findOneSector(@Param('id') id: string) {
    return this.aboutMeService.findOneSector(id);
  }

  @Patch('sectors/:id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Work sector updated successfully')
  @UseInterceptors(
    FileInterceptor('sectorImg', {
      storage: memoryStorage(),
    }),
  )
  updateSector(
    @Param('id') id: string,
    @Body() updateWorkSectorDto: UpdateWorkSectorDto,
    @UploadedFile() sectorImg?: Express.Multer.File,
  ) {
    return this.aboutMeService.updateSector(id, updateWorkSectorDto, sectorImg);
  }

  @Delete('sectors/:id')
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Work sector deleted successfully')
  removeSector(@Param('id') id: string) {
    return this.aboutMeService.removeSector(id);
  }
}
