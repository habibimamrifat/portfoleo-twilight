import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudanry.service';

@Global()
@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
