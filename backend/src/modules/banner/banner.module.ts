import { Module } from '@nestjs/common';
import { BannerQuoteController } from './banner.controller';
import { BannerQuoteService } from './banner.service';

@Module({
  controllers: [BannerQuoteController],
  providers: [BannerQuoteService],
})
export class BannerQuoteModule {}
