import { Module } from '@nestjs/common';

import { ProcessStepsController } from './process-step.controller';
import { ProcessStepsService } from './process-step.service';

@Module({
  controllers: [ProcessStepsController],
  providers: [ProcessStepsService],
})
export class ProcessStepsModule {}
