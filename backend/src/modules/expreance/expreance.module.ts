import { Module } from '@nestjs/common';

import { ExperiencesService } from './expreance.service';
import { CloudinaryModule } from '../../helpers/cloudinary/cloudinary.module';
import { ExperiencesController } from './exprience.controller';

@Module({
  imports: [CloudinaryModule],
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
})
export class ExperiencesModule {}
