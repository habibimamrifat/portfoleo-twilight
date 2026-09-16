import { Module } from '@nestjs/common';

import { BlogCommentsController } from './blog-comments.controller';
import { BlogCommentsService } from './blog-comments.service';

@Module({
  controllers: [BlogCommentsController],
  providers: [BlogCommentsService],
  exports: [BlogCommentsService],
})
export class BlogCommentsModule {}
