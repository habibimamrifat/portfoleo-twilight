import { Module } from '@nestjs/common';

import { ProjectCommentController } from './project-comment.controller';
import { ProjectCommentService } from './project-comment.service';

@Module({
  controllers: [ProjectCommentController],
  providers: [ProjectCommentService],
  exports: [ProjectCommentService],
})
export class ProjectCommentModule {}
