import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { BannerQuoteService } from './banner.service';
import { RouteFor, routeTypeObj } from '../../decorators/route.decorator';
import { ResponseMessage } from '../../decorators/response-message.decorator';
import { CreateBannerQuoteDto } from './dto/banner-quote.dto';

@Controller('banner-quote')
export class BannerQuoteController {
  constructor(private readonly bannerQuoteService: BannerQuoteService) {}

  @Get()
  @RouteFor(routeTypeObj.PUBLIC)
  @ResponseMessage('Banner quote retrieved successfully')
  findOne() {
    return this.bannerQuoteService.findOne();
  }

  @Post()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Banner quote created successfully')
  create(@Body() bannerQuoteDto: CreateBannerQuoteDto) {
    return this.bannerQuoteService.create(bannerQuoteDto);
  }

  @Patch()
  @RouteFor(routeTypeObj.ADMIN)
  @ResponseMessage('Banner quote updated successfully')
  update(@Body() bannerQuoteDto: CreateBannerQuoteDto) {
    return this.bannerQuoteService.update(bannerQuoteDto);
  }
}
