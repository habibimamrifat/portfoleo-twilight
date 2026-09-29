import { Module } from '@nestjs/common';

import { ProjectApproachController } from './project-approach.controller';
import { ProjectApproachService } from './project-approach.service';

@Module({
  controllers: [ProjectApproachController],
  providers: [ProjectApproachService],
})
export class ProjectApproachModule {}
