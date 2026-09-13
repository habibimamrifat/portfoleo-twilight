import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './system/system.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PipeModule } from './pipes/validation.pipe';

@Module({
  imports: [SystemModule, AuthModule, UserModule, PipeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
