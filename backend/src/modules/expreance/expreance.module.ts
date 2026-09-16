import { Module } from '@nestjs/common';
import { ExperiencesController } from './exprience.controller';
import { ExperiencesService } from './expreance.service';

@Module({
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
})
export class ExperiencesModule {}
