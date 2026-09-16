import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './modules/system/system.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PipeModule } from './pipes/validation.pipe';
import { PrismaModule } from './prisma/prisma.module';
import { AppConfigModule } from './config/config.module';
import { JwtCustomModule } from './helpers/jwt/jwtCustom.service';
import { BcryptModule } from './helpers/bcript/bcript.module';
import { ServicesModule } from './modules/services/sevice.module';
import { ProjectsModule } from './modules/peojects/projects.module';

import { ProcessStepsModule } from './modules/process/process-step.module';
import { ExperiencesModule } from './modules/expreance/expreance.module';
import { ToolsModule } from './modules/tools/tools.module';
import { BlogModule } from './modules/blog/blog.module';
import { BlogCommentsModule } from './modules/blog-comments/blog-comments.module';

@Module({
  imports: [
    SystemModule,
    AuthModule,
    UserModule,
    PipeModule,
    PrismaModule,
    AppConfigModule,
    JwtCustomModule,
    BcryptModule,
    ServicesModule,
    ProjectsModule,
    ExperiencesModule,
    ProcessStepsModule,
    ToolsModule,
    BlogModule,
    BlogCommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
