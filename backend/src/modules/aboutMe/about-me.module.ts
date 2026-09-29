import { Module } from '@nestjs/common';

import { AboutMeController } from './about-me.controller';
import { AboutMeService } from './about-me.service';

@Module({
  controllers: [AboutMeController],
  providers: [AboutMeService],
})
export class AboutMeModule {}
